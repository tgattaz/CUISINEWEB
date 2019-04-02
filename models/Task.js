var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TaskSchema = new Schema({
  text : String,
  date : String,
  creator : String,
  done : Boolean
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;