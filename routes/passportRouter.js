//Import necessary packages and modules & set = to variables
const {BasicStrategy} = require('passport-http');
const mongoose = require('mongoose');
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');
const {User} = require('../models/users');
//router is an instance of the express.Router()
const router = express.Router();
//router instance will use jsonParser middleware
router.use(jsonParser);

//----------------------  Create basicStrategy middleware  ------------------------------

//basicStrategy middleware is created using BasicStrategy module(?) from passport.js
//Is this BasicStrategy for a signup?  Or login?  or both?
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;  //declare random variable named user
  User  //instance of the module from user.js
    .findOne({username: username})  //look for the username entered in by form
    .exec()  //returns a Promise - how & why?
    .then(_user => {   //fxn that takes 1 parameter _user, which is the username retrieved (or not) from the DB.
      user = _user;  //_user retrieved from DB & assigned to empty variable user
      if (!user) {  //if user is undefined, then proceed to next line
        return callback(null, false);  //the arguments null & false are passed into the callback fxn. to process
      }
      return user.validatePassword(password);  //this is run if the DB returns a user, which only happens if username entered by form & username in DB are eqv.
      //validatePassword is a method called on this instance of a user from user.js, using bcrypt to match passwords.
    })
    .then(isValid => {  //the above Promise is resolved & passed in as an isValid parameter
      if (!isValid) {  //if user is undefined, then proceed to next line
        return callback(null, false);  //the arguments null & false are passed into the callback fxn. to process
      }
      else {  //assume that the pw matches the username
        return callback(null, user);  //the arguments null & user are passed into the callback fxn. to process
      }
    })
    .catch(err => callback(err));  //some error is returned by the Promise above, pass it to the callback fxn to process
});

passport.use(basicStrategy);  //passport instance can use basicStrategy middleware
router.use(passport.initialize());  //router instance can use passport middleware with the initialize method

//---------------------------------------------------------------------------------------

        //GET a list of all users - only use this search for friends screen
        router.get('/', (req, res) => {
          return User
            .find()
            .exec()
            .then(users => res.json(users.map(user => user.formattedUser())))
            .catch(err => console.log(err) && res.status(500).json({message: 'Internal server error'}));
        });

//-------------------  Definitely the Signup screen  -----------------------------------

//POST one user with unique username for signup screen
router.post('/', (req, res) => {
  //req.body = {username: "<user>", password: "<pw>"};
  //which is eqv to:  var username = "<user>";   var password = "<pw>";
  let {username, password} = req.body;
  if (!req.body) {
    console.log("Even w/o a request body, this never executes. Why?");
    return res.status(400).json({message: 'No request body'});
  }
  // check for existing user
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
router.post('/me', passport.authenticate('basic', {
    successRedirect : '/settings',
    failureRedirect : '/',
    failureFlash : true,
    session: true
  }));

module.exports = router;

