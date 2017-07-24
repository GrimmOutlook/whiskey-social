const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

// expose fxn to the app:
module.exports = function(passport) {
  // Only the user ID is serialized to the session, keeping the amount of data stored within the session small.

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    // used to deserialize the user for the session
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

  // LocalStrategy named 'local-signup'--------------------------------------------------

  passport.use('local-signup', new LocalStrategy(
  //     // by default, local strategy uses username and password
  //     { usernameField : 'userName' || 'email',
  //     passwordField : 'password',
  //     passReqToCallback : true // pass back the entire request to the callback
  //   },
    function(req, email, password, done) {
      // find user + email = same as form email
      User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) {
          return done(err);
        }
        // check if user with that email currently exists
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken'));
        }
        else {
          let newUser = new User();
          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password); // use the hashPassword fxn in user model

          newUser.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
          });
        }

      });

    }));
};
