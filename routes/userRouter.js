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
  console.log('This is the Settings page');
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

//--------------------------- Newsfeed Page -------------------------------------------
router.get('/:id/newsfeed', function(req, res){
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

//--------------------------- My-posts Page -------------------------------------------
router.get('/:id/history', function(req, res){
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

//---------------------------- My Friends Page -----------------------------------------
router.get('/:id/friends', function(req, res){
  console.log('This is the my friends page');
  User                                        //Look in user model
  .findById(req.params.id)                    //GET User by id
  .exec()
  .then(function(user){                       //Pass User into fxn.
    const friendsArray = [];
     console.log("myFriends array: " + user.myFriends);
      user.myFriends.forEach(function(id){  //for every user id in myFriends array
        User                                  //Look in user model again
        .findById(id)                         //find id of original user's friend
        .exec()
        .then(user => {                     //Pass that user's info into fxn.
          friendsArray.push(user);  //Push entire user object into the array
          console.log("There should be stuff in this array!: " + friendsArray);
          return friendsArray;  //returns an array of user objects
        });
      })
      // console.log("friendsArray results1: " + friendsArray);
      // return friendsArray;                    //fxn. returns the friendsArray
      // res.render('friend-list', friendsArray);
    })
     .then(function(friendsArray){   //where tf did the friendsArray go to?!
        console.log("friendsArray after another .then: " + friendsArray);
      })
  // .then(results => {
  //   console.log("friendsArray results2: " + results);
  //     res.render('friend-list', results.map(
  //         (result) => result.friendsOfUser)
  //     );
  //   })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the my friends page.'});
    });
})


  // function findFriends(req, res, user) {
  //   const friendsArray = [];
  //     user.myFriends.forEach(function(id){
  //       //for each item in array, find the userID associated with that user
  //       //then render the username / userID combo
  //       User
  //       .findById(id)
  //       .exec()
  //       .then(user => {
  //         friendsArray.push(user.friendsOfUser);
  //       })
  //     })
  //     res.render('friend-list', friendsArray);
  // }

//------------------------------ Account Delete Page ------------------------------------
router.get('/:id/delete-account', function(req, res){
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

module.exports = router;




