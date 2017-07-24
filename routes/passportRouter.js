const {BasicStrategy} = require('passport-http');
const mongoose = require('mongoose');
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');

const {User} = require('../models/users');

const router = express.Router();

router.use(jsonParser);

// const basicStrategy = new BasicStrategy((username, password, callback) => {
//   let user;
//   User
//     .findOne({username: username})
//     .exec()
//     .then(_user => {
//       user = _user;
//       if (!user) {
//         return callback(null, false);
//       }
//       return user.validatePassword(password);
//     })
//     .then(isValid => {
//       if (!isValid) {
//         return callback(null, false);
//       }
//       else {
//         return callback(null, user);
//       }
//     })
//     .catch(err => callback(err));
// });

// passport.use(basicStrategy);
// router.use(passport.initialize());

          //  OR THIS:

// const strategy = new BasicStrategy(
//   (username, password, cb) => {
//     User
//       .findOne({username})
//       .exec()
//       .then(user => {
//         if (!user) {
//           return cb(null, false, {
//             message: 'Incorrect username'
//           });
//         }
//         if (user.password !== password) {
//           return cb(null, false, 'Incorrect password');
//         }
//         return cb(null, user);
//       })
//       .catch(err => cb(err))
// });

// passport.use(strategy);

//GET a list of all users
router.get('/', (req, res) => {
  return User
    .find()
    .exec()
    .then(users => res.json(users.map(user => user.formattedUser())))
    .catch(err => console.log(err) && res.status(500).json({message: 'Internal server error'}));
});

//POST one user with unique username
router.post('/', (req, res) => {
  //req.body = {username: "<user>", password: "<pw>"};
  //var username = "<user>";   var password = "<pw>";
  let {username, password} = req.body;
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  // check for existing user
  return User
    //.find({username: "<user>"})
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      // if no existing user (count = 0), hash password
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
      return res.status(201).json(user.formattedUser());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
});

module.exports = router;

