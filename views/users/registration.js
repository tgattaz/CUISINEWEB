var Inscription = angular.module('Inscription', []);

function mainController($scope, $http) {
  $scope.insData = {};

  $scope.createUser = function() {
    if(validateForm(event)){
        $http.post('/newUser', $scope.insData)
        .success(function(data) {
            $scope.insData = {}; // clear the form so our user is ready to enter another
            window.location.replace("/confirmation");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }
};
}

document.addEventListener("DOMContentLoaded", function(event) {
    var btSwitch = document.getElementById("formInscr");
    var nom = document.getElementById("nom");
    nom.addEventListener("focus", function () {
        document.getElementById("aidenom").textContent = " - 6 à 24 caractères";
    })
    nom.addEventListener("input", function () {
        verifnom(nom);
    });
    nom.addEventListener("blur", function () {
        finnom(nom);
        document.getElementById("aidenom").textContent = "";
    });

    var mdp = document.getElementById("pass1");
    var mdp2 = document.getElementById("pass2");

    mdp.addEventListener("focus", function () {
        document.getElementById("aidemdp").textContent = " - 7 et 22 caractères";
    });
    mdp.addEventListener("input", function () {
        verifmdp(mdp);
    });
    mdp.addEventListener("blur", function () {
        finmdp2(mdp,mdp2);
        document.getElementById("aidemdp").textContent = "";
    });
    mdp2.addEventListener("focus", function () {
        document.getElementById("aidemdp2").textContent = " - Doit être identique";
    });
    mdp2.addEventListener("input", function () {
        verifmdp2(mdp,mdp2);
    });
    mdp2.addEventListener("blur", function () {
        finmdp2(mdp,mdp2);
        document.getElementById("aidemdp2").textContent = "";
    });
});

function verifnom(champ)
{
   if(champ.value.length < 6 || champ.value.length > 24){
      surligne(champ, true);
      return false;
   } else {
      surligne(champ, false);
      return true;
   }
}

function finnom(champ){
    if(verifnom(champ)){
      champ.style.backgroundColor = "";
    }
}

function verifmdp(champ){
   if(champ.value.length < 7 || champ.value.length > 22){
      surligne(champ, true);
      return false;
   } else {
      surligne(champ, false);
      return true;
   }
}

function verifmdp2(champ, champ2){
   if(champ.value != champ2.value){
      surligne(champ2, true);
      return false;
   }
   else{
      surligne(champ2, false);
      return true;
   }
}

function finmdp2(champ, champ2){
    if(verifmdp2(champ, champ2))
    {
      champ.style.backgroundColor = "";
      champ2.style.backgroundColor = "";
    }
}

function surligne(champ, erreur){
   if(erreur)
      champ.style.backgroundColor = "#fba";
   else
      champ.style.backgroundColor = "#afb";
}

function validateForm(event)
{
        event.preventDefault();
        if(!verifnom(nom) || !verifmdp(pass1) || !verifmdp2(pass1,pass2))
        {
          document.getElementById("warning").textContent = " - Erreur ! vérifier votre formulaire !";
          return false;
        }
        else
        {
            document.getElementById("warning").color = "green";
            document.getElementById("warning").textContent = " - Formulaire valdié, envoi ...";
            return true;
        }
}