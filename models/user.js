var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  mail: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', UserSchema)