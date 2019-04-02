var ListeGestion = angular.module('ListeGestion', []);

function mainController($scope, $http, $location) {

  $scope.listData = {};
  $scope.collabData = {};
  var identifiant = document.getElementById('id').innerHTML;
  var collab_list;

  $scope.createList = function() {
    if (document.getElementById('create-list').innerHTML=='Ajouter une liste') {
        $scope.listData.name = '';
        $scope.listData.description = '';
        document.getElementById('listname_label').style.display = "block";
        document.getElementById('listname').style.display = "block";
        document.getElementById('listdesc_label').style.display = "block";
        document.getElementById('listdesc').style.display = "block";
        document.getElementById('create-list').innerHTML='✔';
    }
    else {
      document.getElementById('listname_label').style.display = "none";
      document.getElementById('listname').style.display = "none";
      document.getElementById('listdesc_label').style.display = "none";
      document.getElementById('listdesc').style.display = "none";
      document.getElementById('create-list').innerHTML='Ajouter une liste';
        $http.post('todolists/api/laliste/create/'+identifiant, $scope.listData)
        .success(function(data) {
            console.log(data);
            window.location.replace("/"+identifiant);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
};

  $scope.deleteList = function(param) {
    $http.delete('todolists/api/laliste/delete/'+identifiant+'/'+param)
    .success(function(data) {
      console.log(data);
      window.location.replace("/"+identifiant);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };

  $scope.addCollab = function(list_id,longueur) {
    for (pas = 1; pas <= longueur; pas++) {
      document.getElementById("add-collab-"+pas).disabled =true;
    }
    document.getElementById('collab-tab').style.display = "block";
    $scope.collabData.list_id=list_id;
  };

  $scope.createCollab = function() {
    $http.post('collabList', $scope.collabData)
      .success(function(result) {
        if (result=='false'){
          document.getElementById('result').color='red';
          document.getElementById('result').innerHTML="Collaboration échouée, pas d'utilisateur "+$scope.collabData.name+" trouvé.";
        } else {
          document.getElementById('result').color='green';
          document.getElementById('result').innerHTML="Collaboration créee avec "+$scope.collabData.name+".";
        }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
  };

  $scope.fermerCollab = function(longueur) {
    for (pas = 1; pas <= longueur; pas++) {
      document.getElementById("add-collab-"+pas).disabled =false;
    }
    document.getElementById('collab-tab').style.display = "none";
    document.getElementById('result').innerHTML="";
  };

}