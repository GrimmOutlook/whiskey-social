const {BasicStrategy} = require('passport-http');
const mongoose = require('mongoose');
const express = require('express');
// const jsonParser = require('body-parser').json();
const passport = require('passport');
const {User} = require('../models/users');
//router is an instance of the express.Router()
const router = express.Router();
//router instance will use jsonParser middleware
// router.use(jsonParser);


//--------------------------  Home Page - index.html  -----------------------------------
router.get('/', (req, res) => {
  console.log("To the home page!");
  res.render('index');
});

//----------------------  Create basicStrategy middleware  ------------------------------
        // WTF IS CALLBACK????????????????????????????????????????????????????????
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User
    .findOne({username: username})
    .then(_user => {
      user = _user;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password',
        });
      }
        return callback(null, user)  //WTF is the callback fxn.?
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);  //WTF is the callback fxn.?
      }
      return callback(err, false);  //WTF is the callback fxn.?
    });
});


//-------------------  Definitely the Signup screen  -----------------------------------
router.get('/signup', (req, res) => {
  console.log("To the signup page!");
  res.render('signup');
});


//POST one user with unique username for signup screen
router.post('/signup', (req, res) => {
  //req.body = {username: "<user>", password: "<pw>"};
  //which is eqv to:  var username = "<user>";   var password = "<pw>";

  let {username, password} = req.body;
  if (!req.body) {
    console.log("Even w/o a request body, this never executes. Why?");
    return res.status(400).json({message: 'No request body'});
  }
  // check for existing user
  console.log("req.body: " + JSON.stringify(req.body));
  return User
    .find({username})   //eqv. to .find({username: "<user>"})
    .count()
    .exec()
    .then(count => {  // if no existing user, then the count = 0. Proceed to call the hashpassword fxn. from users.js
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash  //,
          // firstName: firstName,
          // lastName: lastName
        })
    })
    .then(user => {
      console.log('This is the user: ' + user);
      res.render('settings', user.formattedUser());
      // return res.status(201).json(user.formattedUser());
    })
    .catch(err => {
      if (err.name === 'AuthenticationError') {
        return res.status(422).json({message: err.message});
      }
      res.status(500).json({message: 'Internal server error'})
    });
});


//Is this the login??
// router.get('/me',
//   passport.authenticate('basic', {session: false}),  //why does 'basic' work?  what is session?
//   (req, res) => res.json({user: req.user.formattedUser()})  //is this the callback fxn that goes into basicStrategy???
// );

//------------------------------ Definitely Login POST  -----------------------------
  //GET the Login Screen
router.get('/login', (req, res) => {
  console.log("To the login page!");
  res.render('login');
});

  //POST the Login info, have passport authenticate it, redirect to settings page
router.post('/me', passport.authenticate('basic', {
    successRedirect : '/settings',
    failureRedirect : '/',
    // failureFlash : true,
    session: true
  }));



const isAuthenticated = function(req,res,next){
  // console.log('fxn isAuthenticated: ' + req.user);
   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      })

}
router.get('/checkauth', isAuthenticated, function(req, res){
  console.log('req.user: ' + req.user);

    res.status(200).json({
        status: 'Login successful!'
    });
});


module.exports = router;

