var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TodolistSchema = new Schema({
  name : String,
  type : String,
  description : String,
  creator : String,
  tasks: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
  ]
});

var Todolist = mongoose.model('Liste', TodolistSchema);

module.exports = Todolist;