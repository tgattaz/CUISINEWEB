var Connexion = angular.module('Connexion', []);

function mainController($scope, $http) {
  $scope.coData = {};
  $scope.result = {};
  $scope.response = {};
  $scope.user = {};

  $scope.connectUser = function() {
    $http.post('/connectUser', $scope.coData)
        .success(function(data) {
            $scope.response.text = data;
            if (data!="Utilisateur non trouvé ou mot de passe incorrect" && data!="Tu as atteints la limite d'essais de connexion"){
                $scope.response.text = 'Bonjour ' + $scope.coData.username + ' ! Redirection sur votre espace en cours ...';
                $scope.user.id = data.replace(/^"(.*)"$/, '$1');
                setCookie('cuisinier', $scope.user.id, 0.01);
                $scope.coData = {};
                $scope.response.color = 'green';
                setTimeout(function(){
                    window.location.replace('/espace');
                }, 2000);
            } else {
                $scope.response.color = 'red';
            };
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log('je te fais un cookie');
  }