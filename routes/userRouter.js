const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const {LocalStrategy} = require('passport-local');
// const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('../models/users');
const {Whiskey} = require('../models/whiskeys');

router.use(jsonParser);

// passport.use(LocalStrategy);
// router.use(passport.initialize());

//--------------------------- Profile Page -------------------------------------------
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
        res.status(500).json({message: 'Something\'s wrong with the profile page.'});
    });
})

//--------------------------- Newsfeed Page -------------------------------------------
router.get('/user/:id/newsfeed', function(req, res){
  console.log('This is the Newsfeed page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('newsfeed', user.formattedUser());
      console.log('Here is the user.id: ' + user.id);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the newsfeed page.'});
    });
})

//--------------------------- Favorites Page -------------------------------------------
router.get('/user/:id/my-favorites', function(req, res){
  console.log('This is the favorites page');
  Whiskey
    .find()
    .exec()
    .then(whiskeys => {
      res.render('my-favorites', {
        whiskeys: whiskeys.map(
          (whiskey) => whiskey)
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Favorites page.'});
    });
})

//--------------------------- My-posts Page -------------------------------------------
router.get('/user/:id/history', function(req, res){
  console.log('This is the my-posts/history page');
  Whiskey
    .find()
    .exec()
    .then(whiskeys => {
      res.render('my-posts', {
        whiskeys: whiskeys.map(
          (whiskey) => whiskey)
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the My-posts/history page.'});
    });
})

//---------------------------- My-unique-posts Page ------------------------------------
router.get('/user/:id/whiskeys', function(req, res){
  console.log('This is the my-posts-unique page');
  Whiskey
    .find()
    .exec()
    .then(whiskeys => {
      res.render('my-posts-unique', {
        whiskeys: whiskeys.map(
          (whiskey) => whiskey)
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the My-unique-posts page.'});
    });
})

//---------------------------- My Friends Page -----------------------------------------
router.get('/user/:id/friends', function(req, res){
  console.log('This is the my friends page');
  User
    .find()
    .exec()
    .then(users => {
      res.render('friend-list', {
        users: users.map(
          (user) => user.profileUser())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the my friends page.'});
    });
})

//------------------------------ Account Delete Page ------------------------------------
router.get('/user/:id/delete-account', function(req, res){
  console.log('This is the Account Delete page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('delete-account', user.formattedUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Account Delete page.'});
    });
})

//------------------------------ Friend Search Page ------------------------------------
router.get('/friend/search', function(req, res){
  console.log('This is the Search for Friend page');
  User
    .find()
    .exec()
    .then(users => {
      res.render('friend-search', {
        users: users.map(
          (user) => user.profileUser())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the my friends page.'});
    });
})




module.exports = router;




