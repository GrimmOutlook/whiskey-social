const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const {LocalStrategy} = require('passport-local');
// const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('../models/users');

router.use(jsonParser);

// passport.use(LocalStrategy);
// router.use(passport.initialize());


router.get('/user/:id', function(req, res){
  console.log('This is the Profile page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('profile', user.formattedUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s happening here, what it is ain\'t exactly clear.'});
    });
})





module.exports = router;




