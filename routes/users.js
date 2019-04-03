var router = require('express').Router();
var dataLayer = require('../dataLayer');

router.get('/', function(req, res) {
  res.render('users/index.html');
});

router.get('/registration', function(req, res) {
  res.render('users/registration.html');
});

router.get('/confirmation', function(req, res) {
  res.render('users/confirmation.html');
});

router.post('/isExist', function(req, res){
  data = req.body;
  dataLayer.isExist(data, function(err,result){
    if(err==null){
      res.send(result);
    }else{
      res.send(false);
    }

  });
});

router.post('/newUser', function(req, res){
  data = req.body;
  dataLayer.createUser(data,function(result){
    res.send(result);
  });
});

router.post('/connectUser', function(req, res) {
  data = req.body;
  dataLayer.connectUser(data,function(user,result){
    if (result==null){
      res.send(user._id);
    } else {
      res.send(result);
    }
  });
});

router.post('/collabList', function(req, res) {
  data = req.body;
  dataLayer.createCollab(data,function(result){
    res.send(result);
  });
});

router.get('/espace', function(req, res) {
  dataLayer.getMySpace(function(result1,result2){
    res.render('users/espace.html', {recettes: result1, restaurants: result2});
  });
});

router.post('/todolist', function(req, res) {
  param = req.body;
  dataLayer.getList(param,function(laliste){
    res.render('todolists/index.html', { liste : laliste});
  });
});



module.exports = router;