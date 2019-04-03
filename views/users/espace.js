var ListeGestion = angular.module('ListeGestion', []);

function mainController($scope, $http, $location) {

  $scope.user = {};
  $scope.user.id = getCookie('cuisinier');
  var identifiant = $scope.user.id;
  if($scope.user.id==''){
    console.log("L'utilisateur n'a pas été trouvé, on lui renvoit une erreur.");
    document.getElementById('erreur-connexion').style.display ="block";
  }else{
    $http.post('/isExist', $scope.user)
    .success(function(data) {
      if(data!='false'){
        if($scope.user.id==data._id){
          $scope.user.id=data._id;
          $scope.user.username = data.username;
          $scope.formData.creator = data.username;
          $scope.user.admin = data.admin;
          console.log("L'utilisateur existe, il s'est bien connecté.");
          document.getElementById('contenu').style.display ="block";
        }else{
          console.log("L'utilisateur n'a pas été trouvé, on lui renvoit une erreur.");
          document.getElementById('erreur-connexion').style.display ="block";
        }
      } else {
        console.log("L'utilisateur n'a pas été trouvé, on lui renvoit une erreur.");
        document.getElementById('erreur-connexion').style.display ="block";
      }
    });
  }

  $scope.laliste = {};
  $scope.formData = {};
  $scope.modifyData = {};

  $scope.listData = {};
  $scope.collabData = {};
  var collab_list;
  var url;

  $scope.consulter = function(param){
    document.getElementById('les-listes').style.display ="none";
    $http.get('todolists/api/laliste/'+param)
    .success(function(res) {
        url = param;
        $scope.laliste = res;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
    document.getElementById('affichage-liste').style.display ="block";
  }

  $scope.revenir = function(){
    document.getElementById('les-listes').style.display ="block";
    document.getElementById('affichage-liste').style.display ="none";
  }

  $scope.isAdmin = function(){
    if($scope.user.admin){
      return true;
    }else{
      return false;
    };
  }

  $scope.isNormal = function(){
    if(!$scope.user.admin){
      return true;
    }else{
      return false;
    };
  }

  $scope.deconnecter = function(){
    document.cookie = "cuisinier=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace('/');
  }

  $scope.createTodo = function() {
    $http.post('todolists/api/laliste/'+url, $scope.formData)
        .success(function(data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  }

  $scope.editList = function() {
    if (document.getElementById('modify-list').innerHTML=='Modifier la liste') {
        $scope.listData.name = $scope.laliste.name;
        $scope.listData.description = $scope.laliste.description;
        document.getElementById('listname').style.display = "none";
        document.getElementById('listname_modify').style.display = "block";
        document.getElementById('listdesc').style.display = "none";
        document.getElementById('listdesc_modify').style.display = "block";
        document.getElementById('modify-list').innerHTML='✔';
    }
    else {
        document.getElementById('listname').style.display = "block";
        document.getElementById('listname_modify').style.display = "none";
        document.getElementById('listdesc').style.display = "block";
        document.getElementById('listdesc_modify').style.display = "none";
        document.getElementById('modify-list').innerHTML='Modifier la liste';
        $http.post('todolists/api/laliste/edit/'+url, $scope.listData)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
};

  $scope.createList = function() {
    if (document.getElementById('create-list').innerHTML=='Ajouter une liste') {
        $scope.listData.name = '';
        $scope.listData.description = '';
        document.getElementById('name_label').style.display = "block";
        document.getElementById('name').style.display = "block";
        document.getElementById('description_label').style.display = "block";
        document.getElementById('description').style.display = "block";
        document.getElementById('type_label').style.display = "block";
        document.getElementById('type').style.display = "block";
        document.getElementById('create-list').innerHTML='✔';
    }
    else {
      document.getElementById('name_label').style.display = "none";
      document.getElementById('name').style.display = "none";
      document.getElementById('description_label').style.display = "none";
      document.getElementById('description').style.display = "none";
      document.getElementById('type_label').style.display = "none";
      document.getElementById('type').style.display = "none";
      document.getElementById('create-list').innerHTML='Ajouter une liste';
        $http.post('todolists/api/laliste/create/'+identifiant, $scope.listData)
        .success(function(data) {
            console.log(data);
            window.location.replace("/espace");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
};

  $scope.deleteList = function(param) {
    console.log(param);
    $http.delete('todolists/api/laliste/delete/'+param)
    .success(function(data) {
      console.log(data);
      window.location.replace("/espace");
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

  $scope.modifyTodo = function(index, x) {
    if (document.getElementById('modify-'+index).innerHTML=='Modifier') {
        for (pas = 0; pas < $scope.laliste.tasks.length; pas++) {
            document.getElementById('xcreatormodify-'+pas).style.display = "none";
            document.getElementById('xtextmodify-'+pas).style.display = "none";
            document.getElementById('xurlmodify-'+pas).style.display = "none";
            document.getElementById('xurl-'+pas).style.display = "block";
            document.getElementById('xcreator-'+pas).style.display = "block";
            document.getElementById('xtext-'+pas).style.display = "block";
            document.getElementById('delete-'+pas).disabled =false;
            document.getElementById('modify-'+pas).innerHTML='Modifier';
        }
        $scope.modifyData.text = x.text;
        $scope.modifyData.creator = x.creator;
        $scope.modifyData.url = x.url;
        document.getElementById('xcreatormodify-'+index).style.display = "block";
        document.getElementById('xtextmodify-'+index).style.display = "block";
        document.getElementById('xurlmodify-'+index).style.display = "block";
        document.getElementById('xurl-'+index).style.display = "none";
        document.getElementById('xcreator-'+index).style.display = "none";
        document.getElementById('xtext-'+index).style.display = "none";
        document.getElementById('delete-'+index).disabled =true;
        document.getElementById('modify-'+index).innerHTML='✔';
    }
    else {
        document.getElementById('xcreatormodify-'+index).style.display = "none";
        document.getElementById('xtextmodify-'+index).style.display = "none";
        document.getElementById('xurlmodify-'+index).style.display = "none";
        document.getElementById('xurl-'+index).style.display = "block";
        document.getElementById('xcreator-'+index).style.display = "block";
        document.getElementById('xtext-'+index).style.display = "block";
        document.getElementById('delete-'+index).disabled =false;
        document.getElementById('modify-'+index).innerHTML='Modifier';
        $http.post('todolists/api/laliste/'+url+'/'+ x._id, $scope.modifyData)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
};

$scope.valideTodo = function(x) {
    $scope.modifyData.valide = x.valide+1;
    $http.post('todolists/api/laliste/valide/'+url+'/'+ x._id, $scope.modifyData)
  .success(function(data) {
    $scope.laliste = data;
    console.log(data);
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
};

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
      $http.delete('todolists/api/laliste/' + url + '/' + id)
      .success(function(data) {
          $scope.laliste = data;
          console.log(data);
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
  };

  $scope.persoNom = function() {
    if (document.getElementById('change-name').innerHTML=='+Nom') {
        $scope.formData.creator = "";
        document.getElementById('change-name-div').style.display = "block";
        document.getElementById('change-name').innerHTML='⌫';
    }
    else {
        $scope.formData.creator = $scope.user.username;
        document.getElementById('change-name-div').style.display = "none";
        document.getElementById('change-name').innerHTML='+Nom';
    };
};


}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}