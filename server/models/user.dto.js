module.exports = class UserDto {

  constructor(user) {
    this.username = user.username;
    this.email = user.email;
  }
}
