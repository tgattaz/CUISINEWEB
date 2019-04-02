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

router.get('/:id', function(req, res) {
  param = req.params;
  dataLayer.getMySpace(param,function(result){
    res.render('users/espace.html', { user: result, id : param.id });
  });
});



module.exports = router;