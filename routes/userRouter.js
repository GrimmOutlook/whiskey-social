const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {LocalStrategy} = require('passport-local');
const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// const {User} = require('../models/users');

router.use(jsonParser);

passport.use(LocalStrategy);
router.use(passport.initialize());


router.get('/', function(req, res){
  console.log('In user router');
  res.json('In user router');
})


router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.html', { message: req.flash('signupMessage') });
  });

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/settings', // redirect to the settings screen
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));


//TODO  Can I do all or most of the validation with Passport???
// router.post('/signup', (req, res) => {
//   // check for existing user
//   return User
//     .find({userName})
//     .count()
//     .exec()
//     .then(count => {
//       if (count > 0) {
//         return res.status(422).json({message: 'username already taken'});
//       }
//       // if no existing user, hash password
//       return User.hashPassword(password)
//     })
//     .then(hash => {
//       return User
//         .create({
//           userName: userName,
//           password: hash,
//           firstName: firstName,
//           lastName: lastName,
//           email: email
//         })
//     })
//     .then(user => {
//       return res.status(201).json(user.apiRepr());
//     })
//     .catch(err => {
//       res.status(500).json({message: 'Internal server error'})
//     });

// });

router.get('/me',
  passport.authenticate('basic', {session: false}),
  (req, res) => res.json({user: req.user.apiRepr()})
);


module.exports = {router};




