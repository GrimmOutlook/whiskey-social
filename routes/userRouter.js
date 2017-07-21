const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {BasicStrategy} = require('passport-http');
const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('../models/users');

router.use(jsonParser);


// NB: at time of writing, passport uses callbacks, not promises
// This looks like promises.  How does that work?!
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false);
      }
      else {
        return callback(null, user);
      }
    })
    .catch(err => callback(err));
});

passport.use(basicStrategy);
router.use(passport.initialize());

//TODO  Can I do all or most of the validation with Passport???
router.post('/signup', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  let {userName, password, name, dob, email} = req.body;

   //TODO: Create Individual Validation Function
  // userName validation ----------------------------------------------------------
  if (!('userName' in req.body)) {
    return res.status(422).json({message: 'Missing field: userName'});
  }

  if (typeof userName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: userName'});
  }

  if (userName === '') {
    return res.status(422).json({message: 'Incorrect field length: userName'});
  }
  userName = userName.trim();

  // password validation ----------------------------------------------------------
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (password.length < 8)  {
    console.log(password.length);
    return res.status(422).json({message: 'You need a longer password, make it at least 8 characters.'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  if (password === 'password') {
    return res.status(422).json({message: 'Do not make password your password!'});
  }
  password = password.trim();

  // name.firstName validation ----------------------------------------------------
  if (!('name.firstName' in req.body)) {
    return res.status(422).json({message: 'Missing field: name.firstName'});
  }

  if (typeof name.firstName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: name.firstName'});
  }

  if (name.firstName === '') {
    return res.status(422).json({message: 'Incorrect field length: name.firstName'});
  }
  name.firstName = name.firstName.trim();

  // name.lastName validation ------------------------------------------------------
  if (!('name.lastName' in req.body)) {
    return res.status(422).json({message: 'Missing field: name.lastName'});
  }

  if (typeof name.lastName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: name.lastName'});
  }

  if (name.lastName === '') {
    return res.status(422).json({message: 'Incorrect field length: name.lastName'});
  }
  name.lastName = name.lastName.trim();

  // email validation ------------------------------------------------------------
  if (!('email' in req.body)) {
    return res.status(422).json({message: 'Missing field: email'});
  }

  if (typeof email !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: email'});
  }

  if (email === '') {
    return res.status(422).json({message: 'Incorrect field length: email'});
  }
  email = email.trim();

  // Age of 21 or older validation -----------------------------------------------
  if (!('dob.month' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.month'});
  }

  if (typeof dob.month === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.month'});
  }

  if (dob.month === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.month'});
  }
  month = dob.month;

  if (!('dob.day' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.day'});
  }

  if (typeof dob.day === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.day'});
  }

  if (dob.day === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.day'});
  }
  day = dob.day;

  if (!('dob.year' in req.body)) {
    return res.status(422).json({message: 'Missing field: dob.year'});
  }

  if (typeof dob.year === 'string') {
    return res.status(422).json({message: 'Incorrect field type: dob.year'});
  }

  if (dob.year === '') {
    return res.status(422).json({message: 'Incorrect field length: dob.year'});
  }
  year = dob.year;

  function ageDetermine(month, day, year){
    let today = new Date();
    let monthDiff = (today.getMonth + 1) - month;
    let dayDiff = today.getDate - day;
    let yearDiff = today.getFullYear - year;
      if (yearDiff < 21){
        //age is less than 21 - no access to site
        let age = 20;
        return age;
      }
      else if (yearDiff > 21){
        //age is >21 - access to site
        let age = 21;
        return age;
      }
      else if (monthDiff < 0){
        // age is less than 21 - no access to site
        let age = 20;
        return age;
      }
      else if (monthDiff > 0){
        //age is > 21 - access to site
        let age = 21;
        return age;
      }
      else if (monthDiff = 0){
        if (dayDiff < 0){
          // age is less than 21 - no access to site
          let age = 20;
          return age;
        }
        else{
          //age is > 21 - access to site
          let age = 21;
          return age;
        }
      }
    }


  const age = ageDetermine(dob.month, dob.day, dob.year);
  if (age < 21){
    //no access to site
    //redirect to homepage
  }
  else{
    //redirect to settings page if userName is unique too.
  }

  // check for existing user
  return User
    .find({userName})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          userName: userName,
          password: hash,
          name: {
            firstName: firstName,
            lastName: lastName
          },
          dob: {
            month: month,
            day: day,
            year: year
          },
          email: email
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });

});

router.get('/me',
  passport.authenticate('basic', {session: false}),
  (req, res) => res.json({user: req.user.apiRepr()})
);


module.exports = {router};




