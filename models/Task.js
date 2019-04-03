var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TaskSchema = new Schema({
  text : String,
  url : String,
  creator : String,
  valide : Number
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;