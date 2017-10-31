// const LocalStrategy = require('passport-local').Strategy;

const express  = require('express');
const app      = express();
// const {PORT, DATABASE_URL} = require('./database');
// const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('./database');
let LocalStrategy;


LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/users');

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, can override with email
        // usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },

    function(req, username, password, done) {
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
      // usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },

    function(req, username, password, done) {
        // if (username)
        //     username = username.toLowerCase();
        // asynchronous
        process.nextTick(function() {
          // if the user is not already logged in:
          if (!req.user) {
            User.findOne({'username' : username}, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);

        // Check to see if all required fields entered.
              const requiredFields = ['username', 'password'];
              const missingField = requiredFields.find(field => !(field in req.body));
              console.log(`missingField: ${missingField}`);
                if (missingField) {
                  return done(null, false, {message: 'Please fill in both username & password.'});
                }

        // All required fields are strings.
              const stringFields = ['username', 'password'];
              const nonStringField = stringFields.find(field =>
                (field in req.body) && typeof req.body[field] !== 'string'
              );
              console.log('nonStringField in passport.js: ' + nonStringField);
                if (nonStringField) {
                 return done(null, false, {message: 'Please use at least one letter for both username & password.'});
                }

        // Trim username & p/w
              const explicityTrimmedFields = ['username', 'password'];
              const nonTrimmedField = explicityTrimmedFields.find(field =>
                req.body[field].trim() !== req.body[field]
              );
              console.log('nonTrimmedField: ' + nonTrimmedField);  //undefined?? Why??
                if (nonTrimmedField) {
                  return done(null, false, {message: 'Please do not use a space at the start or end of your username or password.'});
                }

        // Reject username & password that are too short/long
              const sizedFields = {
                username: {min: 1, max: 72},
                password: {min: 10, max: 72}
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
                  return done(null, false, {message: 'This should be a better error message.'});
              }

        // Check to see if theres already a user with that username
              if (user) {
                  console.log('req.flash: ', req.flash);
                  return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
              } else {
                  // Create the user
                  var newUser = new User();
                  newUser.username = username;
                  newUser.password = newUser.generateHash(password);

                  newUser.save(function(err) {
                      if (err)
                          return done(err);

                      return done(null, newUser);
                  });
                }
            });
          }
          else{
              console.log(req.user);
          }
        });
    }));
    if (process.env.NODE_ENV == 'test') {
      passport.authenticate = () => true;
    }
    // function(username, password, done) {
    //   User.findOne({'username' : username}, function(err, user) {
    //     if (err)
    //       return done(err);

    //     if (user) {
    //       console.log('req.flash: ', req.flash);
    //       return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
    //     }

    //     var validPassword = user.comparePassword(password);
    //     if(!validPassword){
    //       return done(null, false, {message: 'Incorrect password' });
    //     }

    //     return done(null, user);
    //   });


};  // module.exports
