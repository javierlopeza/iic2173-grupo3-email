var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

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
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });

});

module.exports = mongoose.model('User', UserSchema);