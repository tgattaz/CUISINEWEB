
/* Les imports */

//Express: infrastructure pour appli web
var express  = require('express');
//Nunjucks : moteur de template Node.JS
var nunjucks = require('nunjucks');
//Mongoose : ODM pour MongoDB et Node.JS
var mongoose = require('mongoose');
//Morgan : Logger, crée les logs
var morgan = require('morgan');
//BodyParser : Intergiciel pour les requêtes HTTP (req.body)
var bodyParser = require('body-parser');

/* Configuration */

//Modèles Mongoose pour insérer les données dans MongoDB en respectant la structure défini dans les schémas
Todolist = require('./models/Todolist');
User = require('./models/User');
Task = require('./models/Task');
//DataLayer : Couche de données, zone de transit vers le gestionnaire de données
var dataLayer = require('./dataLayer');

//Lancement de notre middleware, serveur Express
var app      = express();
//ajout du logger
app.use(morgan('dev'));
//Prends en charge le parsing des URL
app.use(bodyParser.urlencoded({'extended':'true'}));
//Prends en charge le parsing des Jsons
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
//défini à nunjucks le path de mes templates/views et référence de mon app express à installer
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

/* Les paths */

//Défini path relatif à partir d'un path absolu
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/views', express.static(__dirname + '/views'));
//Défini path relatif à partir d'un autre path relatif
app.use('/todolists', require('./routes/todolists'));
app.use('/', require('./routes/users'));

/* Lancement */

/* AVANT SURCOUCHE DATALAYER*/
//Connexion à la BDD MongoDB (local ou Atlas Cloud)
// mongoose.connect('mongodb+srv://user:user@cluster0-zt25f.mongodb.net/todolist', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });
//Lance ma socket UNIX, j'écoute les connexions sur le path donné
// app.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

/* APRES SURCOUCHE DATALAYER AJOUTEE*/
dataLayer.init(function(){
  console.log('Initialisation du dataLayer');
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});