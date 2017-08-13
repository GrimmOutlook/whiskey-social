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

//GET a list of all users - only use this search for friends screen
// router.get('/', (req, res) => {
//           return User
//             .find()
//             .exec()
//             .then(users => res.json(users.map(user => user.formattedUser())))
//             .catch(err => console.log(err) && res.status(500).json({message: 'Internal server error'}));
//         });

//--------------------------- Profile Page ---------------------------------------------
router.get('/:id', function(req, res){
  console.log('This is the Profile page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('profile', user.profileUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the profile page.'});
    });
})

//----------------------- User Settings Page -------------------------------------------
router.get('/:id/settings', function(req, res){
  console.log('This is the Settings page - GET');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('settings', user.formattedUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the settings page.'});
    });
})
          //------ POST/PUT changes to user settings fields ---------------//
router.post('/:id/settings', function(req, res){
  console.log('This is the Settings page - POST');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('settings', user.formattedUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the settings page.'});
    });
})

//--------------------- My-posts (history) Page -----------------------------------------
router.get('/:id/post-history', function(req, res){
  console.log('This is the my-posts/history page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      //take the user and map each user.post
      res.render('post-history', user);
      // console.log(user);
      console.log(user.posts);
      // user.posts.map(post => {
      //   console.log(post);
      // })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the My-posts/history page.'});
    });
})


//--------------------------- Favorites Page -------------------------------------------
router.get('/:id/my-favorites', function(req, res){
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

//---------------------------- My-unique-posts Page ------------------------------------
router.get('/:id/whiskeys', function(req, res){
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

//------------------------------ Account Delete Page ------------------------------------
router.get('/:id/delete-account', function(req, res){
  console.log('This is the Account Delete page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      console.log(user);
      res.render('delete-account', user.formattedUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Account Delete page.'});
    });
})

router.post('/:id/delete-account', function(req, res){
  User.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log('Why won\'t this shit delete?');
      res.sendFile('/index.html');
      console.log('User has been removed from the database.');
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Account Delete page.'});
    });
})

module.exports = router;




