const dbConfig = require('./config/db');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const expressSession = require('express-session');
const bCrypt = require("bcrypt-nodejs");
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 3011;

const isValidPassword = function (user, password) {
  return bCrypt.compareSync(password, user.password);
};
const createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

app.use(expressSession({
  secret: 'mySecretKey',
  cookie: {secure: true}
}));
app.use(passport.initialize({}));
app.use(passport.session({}));
app.use(express.json({type: 'application/json'}));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
  User.findOne({'username': username}, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              console.log('User Not Found with username ' + username);
              return done(null, false, req.flash('message', 'User Not found.'));
            }
            if (!isValidPassword(user, password)) {
              console.log('Invalid Password');
              return done(null, false, req.flash('message', 'Invalid Password'));
            }
            return done(null, user);
          }
  );
}));

passport.use('signup', new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
          let findOrCreateUser = function () {
            User.findOne({'username': username}, function (err, user) {
              if (err) {
                console.log('Error in SignUp: ' + err);
                return done(err);
              }
              if (user) {
                console.log('User already exists');
                return done(null, false,
                        req.flash('message', 'User Already Exists'));
              } else {
                const newUser = new User();
                newUser.username = username;
                newUser.password = createHash(password);
                newUser.email = req.param('email');
                newUser.firstName = req.param('firstName');
                newUser.lastName = req.param('lastName');

                newUser.save(function (err) {
                  if (err) {
                    console.log('Error in Saving user: ' + err);
                    throw err;
                  }
                  console.log('User Registration succesful');
                  return done(null, newUser);
                });
              }
            });
          };
          process.nextTick(findOrCreateUser);
        })
);

mongoose.connect(dbConfig.uri);
mongoose.connection.on('error', () => {
  console.error('connection error:');
});

mongoose.connection.once('open', function () {

  app.post('/api/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash : true
  }));

  app.post('/api/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
});
