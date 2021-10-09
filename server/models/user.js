let mongoose = require('mongoose');

const User = mongoose.model('Task', new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  gender: String,
}));

User.create = function (newUser, callback) {
  newUser.save(callback);
};

module.exports = User;
