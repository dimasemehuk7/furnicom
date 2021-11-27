const dbConfig = require('./config/db');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const expressSession = require('express-session');
const {StatusCodes} = require('http-status-codes');
const AuthMiddlewares = require('./middlewares/auth-middlewares');
const {loadUser} = require("./middlewares/auth-middlewares");
const MongoStore = require('connect-mongo');
const UserDto = require('./models/user.dto');

const app = express();
const port = 3011;

app.use(expressSession({
  secret: 'mySecretKey',
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  },
  store: MongoStore.create({mongoUrl: dbConfig.uri})
}));
app.use(express.json({type: 'application/json'}));

mongoose.connect(dbConfig.uri);
mongoose.connection.on('error', () => {
  console.error('connection error:');
});

mongoose.connection.once('open', function () {
  app.use(loadUser);

  app.get('/api/is-authorized', function (req, res) {
    res.send({authorized: Boolean(req.session.authorized)});
  });

  app.get('/api/logged-in-user', function (req, res) {
    res.send({loggedInUser: req.loggedInUser || null});
  });

  app.get('/api/private', AuthMiddlewares.authOnly, function (req, res) {
    res.end('Private data');
  });

  app.get('/api/public', function (req, res) {
    res.end('Public data');
  });

  app.post('/api/login', async (req, res) => {
    const credentials = req.body;
    const user = await User.findOne({'username': credentials.username});
    const userNotFoundError = {
      code: 'A',
      section: 'auth',
      type: 'ERROR',
      description: 'Incorrect username or password'
    };
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).send(userNotFoundError);
      return;
    }
    if (user.encryptPassword(credentials.password) !== user.hashedPassword) {
      res.status(StatusCodes.BAD_REQUEST).send(userNotFoundError);
      return;
    }
    req.session.userId = user.id;
    req.session.authorized = true;
    res.send(new UserDto(user));
  });

  app.post('/api/logout', function (req, res) {
    req.session.destroy();
    res.end();
  });

  app.post('/api/register', async (req, res) => {
    const registrationData = req.body;
    const user = await User.findOne({
      $or: [
        {'email': registrationData.email},
        {'username': registrationData.username}
      ]
    });
    if (user) {
      const errors = [];
      if (user.email === registrationData.email) {
        errors.push({
          code: 'A',
          section: 'auth',
          type: 'ERROR',
          field: 'email',
          description: 'Email is already in use.'
        });
      }
      if (user.username === registrationData.username) {
        errors.push({
          code: 'B',
          section: 'auth',
          type: 'ERROR',
          field: 'username',
          description: 'Username is already in use.'
        });
      }
      console.log(errors)
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }
    User.create({
      username: registrationData.username,
      email: registrationData.email,
      password: registrationData.password
    }, function (err, user) {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        return;
      }
      res.send(new UserDto(user));
    });
  });

  app.get('/api/nav-items', function (req, res) {
    const navigationConfig = {
      items: [
        {code: 'home', name: 'home', url: '/home'},
        {code: 'products', name: 'products', url: '/products'}
      ]
    };

    if (req.session.authorized) {
      navigationConfig.items.push({code: 'dashboard', name: 'dashboard', url: '/dashboard'});
    }

    res.send(navigationConfig);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
});
