const {StatusCodes} = require('http-status-codes');
const User = require("../models/user");

module.exports = {
  loadUser: async (req, res, next) => {
    if (req.session.userId) {
      req.loggedInUser = await User.findOne({'id': req.session.userId});
    }
    next();
  },
  authOnly: async (req, res, next) => {
    if (req.session.authorized) {
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send();
    }
  }
};
