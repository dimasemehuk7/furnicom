const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  username: {
    type: String,
    index: true,
    unique: true
  },
  salt: String,
  hashedPassword: String
});

UserSchema.loadClass(class {
  set password(password) {
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  }

  static create(userData, callback) {
    const user = new User(userData);
    return user.save((err) => callback(err, user));
  };

  encryptPassword(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }

  makeSalt() {
    return crypto.randomBytes(16);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
