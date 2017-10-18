const LocalStrategy = require('passport-local').Strategy;

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

        if (username)
            username = username.toLowerCase(); // avoid case-sensitive matching

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

        if (username)
            username = username.toLowerCase(); // avoid case-sensitive matching

        // asynchronous
        process.nextTick(function() {
          // if the user is not already logged in:
          if (!req.user) {
            User.findOne({'username' : username}, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);
              // check to see if theres already a user with that username
              if (user) {
                  return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
              } else {
                  // create the user
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
        });
    }));

};
