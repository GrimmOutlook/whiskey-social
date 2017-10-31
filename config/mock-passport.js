var passport = require('passport'),
StrategyMock = require('./strategy-mock');

module.exports = function(app, options) {
  // create your verify function on your own -- should do similar things as
  // the "real" one.
  function verifyFunction (user, done) { // user = { id: 1};
   // Emulate database fetch result
    var mock = {
       id: 1,
       role: User.ROLE_DEFAULT,
       username: 'pleasework',
       password: 'password10'
      };
      done(null, mock);
    };

  passport.use(new StrategyMock(options, verifyFunction));

  app.get('/mock/login', passport.authenticate('mock'));
};
