var client = require('mongoose');
var urlmongo = 'mongodb+srv://user:user@cluster0-zt25f.mongodb.net/cuisine';
var db;

var Todolist = require('./models/Todolist');
var User = require('./models/User');
var Task = require('./models/Task');

var dataLayer = {
  init : function(cb){
    //Initialise la connexion entre l'API et notre BDD
    client.connect(urlmongo, { useNewUrlParser: true});
    db = client.connection;
    db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
    db.once('open', function (){
    console.log("Connexion à la base OK");
    });
    //callback vide
    cb();
  },
  insertTask : function(param,data,cb){
  Task.create({
    text : data.text,
    creator : data.creator,
    url: data.url,
    valide : 0
  }, function(err, task) {
    if (err)
      cb(err);
    Todolist.findByIdAndUpdate(param.id, {$push: {tasks: task._id}}, {'new':true}, cb);
  });
  },
  updateTask : function(param,data,cb) {
  Task.updateOne({
    _id : param.task_id
  },{
    text : data.text,
    url : data.url,
    creator : data.creator
  }, function(err) {
    if (err)
        cb(err);
    cb();
  });
  },
  updateValide : function(param,data,cb) {
  Task.updateOne({
    _id : param.task_id
  },{
    valide : data.valide
  }, function(err) {
    if (err)
        cb(err);
    cb();
  });
  },
  deleteDone : function(cb) {
  Task.deleteMany({
    done : true
  }, function(err) {
    if (err)
        cb(err);
    cb();
  });
  },
  delete : function(param,cb) {
  console.log(param);
  Task.deleteOne({
    _id : param.task_id
  }, function(err) {
    if (err)
        cb(err);
    Todolist.findByIdAndUpdate(param.id, {$pull: {tasks: param.task_id}}, {'new':false}, cb);
  });
  },
  getMySpace: function(cb) {
    Todolist.find({ type: 'recettes' }).then(recettes => { Todolist.find({ type: 'restaurants' }).then(restaurants => { cb(recettes,restaurants) });
    });
  },
  isExist: function(data,cb) {
    User.findById(data.id,function(err, user) {
      cb(err,user);
    });
  },
  getList: function(param,cb) {
    Todolist.findById(param.id).populate('tasks').then(theliste => {cb(theliste)});
  },
  createList: function(param,data,cb) {
    Todolist.create({
      name : data.name,
      type : data.type,
      description : data.description
    }, function(err, list) {
      if (err)
        cb(err);
      User.findByIdAndUpdate(param.id, {$push: {listes: list._id}}, {'new':true});
      cb();
      //User.findByIdAndUpdate('5ca3b24dcf661dc9bc8e28dc', {$push: {listes: list._id}}, {'new':true}, cb);
    });
    },
  editList: function(param,data,cb) {
    Todolist.findByIdAndUpdate(param.id, {name: data.name, description: data.description}, cb);
  },
  deleteList: function(param,cb) {
    Todolist.remove({ _id: param.id }, function(err) {
      if (!err) {
        cb();
      }
      else {
        cb(err);
      }
  });
    cb();
  },
  createCollab: function(data,cb){
    User.findOne({ username: data.name }).then(user=> {
        if(user==null) cb(false);
        User.findByIdAndUpdate(user._id, {$push: {listes: data.list_id}}, {'new':true}, cb);
    });
  },
  createUser : function(data,cb) {
  // create a user a new user
  var newUser = new User({
  username: data.username,
  password: data.password
  });

  // save user to database
  newUser.save({}, function(err) {
  if (err)
    cb(err);
  cb();
  });
  },
  connectUser: function(data,cb) {
  // attempt to authenticate user
  User.getAuthenticated(data.username, data.password, function(err, user, reason) {
  if (err)
    cb(null, err);
  // login was successful if we have a user
  if (user) {
    // handle login success
    cb(user, null);
    return;
  }
  // otherwise we can determine why we failed
  var reasons = User.failedLogin;
  switch (reason) {
    case reasons.NOT_FOUND:
      cb(null, 'Utilisateur non trouvé ou mot de passe incorrect');
      return;
    case reasons.PASSWORD_INCORRECT:
      cb(null, 'Utilisateur non trouvé ou mot de passe incorrect');
      return;
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        //break;
    case reasons.MAX_ATTEMPTS:
      cb(null, "Tu as atteints la limite d'essais de connexion");
      return;
        // send email or otherwise notify user that account is
        // temporarily locked
        //break;
  }
  });
  }
}

module.exports = dataLayer;