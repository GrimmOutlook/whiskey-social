const {BasicStrategy} = require('passport-http');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {User} = require('../models/users');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//router is an instance of the express.Router()
const router = express.Router();

//Create an authentication token using jsonwebtoken npm package:
//Used in the login POST endpoint & provides token for future API requests.
const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


//--------------------------  Home Page - index.html  -----------------------------------
  //--------- No Auth or JWT needed ----------------
router.get('/', (req, res) => {
  console.log("To the home page!");
  res.render('index');
});


//-----------------------------  Signup screen  -----------------------------------
router.get('/signup', (req, res) => {
  console.log("To the signup page!");
  res.render('signup');
});


// Post to register a new user
router.post('/signup', jsonParser, (req, res) => {
  // My site has front-end validation for username & password.  Still need this?
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  // Checks to make sure form fields entered are strings.  Necessary? What else can they be?
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(field =>
    (field in req.body) && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(field =>
    req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with a space',
      location: nonTrimmedField
    });
  }
  // Min. username & password are validated on front-end, just do the Max?
  const sizedFields = {
    username: {
      min: 1,
      max: 40
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField ?
        `Must be at least ${sizedFields[tooSmallField].min} characters long` :
        `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
  // Destructuring assignments - names must match up:
  let {firstName='', lastName='', password, username, email} = req.body;
  // Username and p/w come in pre-trimmed, otherwise we throw an error before this
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  return User
    .find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          firstName: firstName,
          lastName: lastName,
          password: hash,
          username: username,
          email: email
        })
    })
    .then(user => {
      return res.status(201).json(user.formattedUser());
      //Render the login page after signup to get the JWT???????????
      // res.render('login', user.formattedUser());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


//------------------------------ Login Screen  -------------------------------------
  //GET the Login Screen
router.get('/login', (req, res) => {
  console.log("To the login page!");
  res.render('login');
});

//Login route: When user enters username & password (POST route): passport authenticates it using the basic strategy.  Then req/res fxn. creates a token using req.user & sends json response of the token:
router.post('/login',
  // The user provides a username and password to login
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    // const authToken = createAuthToken({username: req.body.username});
    const authToken = createAuthToken(req.user.formattedUser());
    // res.json({authToken});
    console.log('typeof: ' + typeof({authToken}));
    res.setHeader('authorization', 'bearer ' + {authToken});
    // res.writeHead(200, {'Authorization': 'Bearer ' + authToken});
    // console.log(`req.session.valid: ${req.session.valid}`);
    console.dir('req.body.user: ' + JSON.stringify(req.body.user));
    console.log({authToken});
    console.log(`req.user within the /login post route: ${req.user}`);
    console.log(`res.header within the /login post route: ${res.header}`);
    res.redirect('/user/' + req.user.id);
  }
);

module.exports = router;

