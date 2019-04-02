var router = require('express').Router();
var dataLayer = require('../dataLayer');

router.get('/', function(req, res) {
  res.render('todolists/index.html');
});

router.get('/#?list=:id', function(req, res) {
    res.render('todolists/index.html');
  });

router.get('/api/laliste/:id', function(req, res) {
    param = req.params;
    dataLayer.getList(param,function(result){
      res.send(result);
    });
});


router.post('/api/laliste/:id', function(req, res) {
    data = req.body;
    param = req.params;
    dataLayer.insertTask(param,data,function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});

router.post('/api/laliste/create/:id', function(req, res) {
    data = req.body;
    param = req.params;
    dataLayer.createList(param,data,function(result){res.send(result)});
});

router.post('/api/laliste/edit/:id', function(req, res) {
    data = req.body;
    param = req.params;
    dataLayer.editList(param,data,function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});

router.delete('/api/laliste/delete/:user/:id', function(req, res) {
    param = req.params;
    dataLayer.deleteList(param,function(result){
        res.send(result);
    });
});

router.post('/api/laliste/:id/:task_id', function(req, res) {
    data = req.body;
    param = req.params;
    dataLayer.updateTask(param,data,function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});

router.post('/api/laliste/done/:id/:task_id', function(req, res) {
    data = req.body;
    param = req.params;
    dataLayer.updateDone(param,data,function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});

router.delete('/api/laliste/:id', function(req, res) {
    dataLayer.deleteDone(function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});

router.delete('/api/laliste/:id/:task_id', function(req, res) {
    param = req.params;
    dataLayer.delete(param,function(){
        dataLayer.getList(param,function(result){
            res.send(result);
        });
    });
});



module.exports = router;