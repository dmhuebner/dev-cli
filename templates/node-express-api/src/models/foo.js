const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const {%firstModel%}Model = new Schema({
  someText: {
    type: String,
    required: true
  },
  anotherThing: {
    type: String
  },
  someBoolean: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('{%firstModel[capitalized]%}', {%firstModel%}Model);
