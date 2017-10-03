const passport = require('passport');
const {BasicStrategy} = require('passport-http');

    // Assigns the Strategy export to the name JwtStrategy using object
    // destructuring
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const {User} = require('../models/users');
const {JWT_SECRET} = require('../config');


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

//New jwtStrategy from JWTStrategy template in passport-jwt:
// JWTStrategy(options, verify):
//   - options: is an object literal containing options to control how the token is extracted from the request or verified.
//   - verify: is a function with the parameters verify(payload, done)
//      - payload: is an object literal containing the decoded JWT payload.
//      - done: is a passport error first callback accepting arguments done(error, user, info)
const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user)
  }
);

module.exports = {basicStrategy, jwtStrategy};
