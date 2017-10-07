const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const config = require('../config');

const {User} = require('../models/users');
const {Whiskey} = require('../models/whiskeys');
const dummyId = "59ceaae756bbb5507df5d765";

// router.use(jsonParser);

// passport.use(LocalStrategy);
// router.use(passport.initialize());

//--------------------------- Profile Page ---------------------------------------------
router.get('/:id', function(req, res){
  console.log('This is the Profile page');
  console.log('req.params.id: ' + req.params.id);
  console.log('req.user within the GET /user/userid route: ' + req.user);
  console.log('is authenticated: ' + req.isAuthenticated())

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
router.get('/:id/settings',
    passport.authenticate('jwt', {session: false}), function(req, res){
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
router.post('/:id/settings',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log('This is the Settings page - POST');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {

      res.render('settings', user.formattedUser());
    })
    // .then
    //  Whiskey.findById
     // find the whiskey and push to post

    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the settings page.'});
    });
})

//--------------------- Post-History Page -----------------------------------------
router.get('/:id/post-history',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log('This is the post-history page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      //just get the whole user and use pug to render what is needed for display
      console.log('example of history page pass to pug: ' + user.posts[30]);
      res.render('post-history', user);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the post-history page.'});
    });
})

//---------------------------- Single Post Page -----------------------------------------
router.get('/:id/single-post/:postID',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log('This is the single-post page');

  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      user.posts.find(function(item){
        // console.log('This is the postID: ' + item);
        if (item._id == req.params.postID){
          console.log('This is the object going to pug: ' + JSON.stringify({"user":dummyId, "item":item}));
          res.render('single-post', {"user": dummyId, "item": item});
        }
      })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the single-post page.'});
    });
})

             //--------- PUT method for adding an additional comment ----------------
router.post('/:userId/single-post/:postId',
    passport.authenticate('jwt', {session: false}), function(req, res){
  const toUpdate = {};
  const updateableFields = ['text'];

  updateableFields.forEach(field => {
    if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
      else {
        console.log('Error message: field isn\'t in req.body');
      }
  });
  const postIdIndex = parseInt(req.params.postId) - 1;
  const commentPush = "posts." + postIdIndex + ".comment";

  // User
  //   .findByIdAndUpdate({req.params.userId, "posts._id" = req.params.postId}, {$push: {"posts.$.comment": {text: toUpdate.text}}})

  User
    .findByIdAndUpdate(req.params.userId)
    .exec()
    .then(user => {
      user.posts.find(item => {
        if (item._id == req.params.postId){
          console.log("item.comment: " + item.comment);
          console.log("toUpdate.text: " + toUpdate.text);
          item.comment.push({text: toUpdate.text});
          console.log("item.comment after: " + item.comment);
          user.save();
        }
      })
    })
    .then(user => {
      res.redirect('/user/' + req.params.userId + '/single-post/' + req.params.postId);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with updating DB.'});
    });

})

             //--------- DELETE method for deleting entire post -------------------
router.delete('/:userId/single-post/:postId',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log("Hey this is the DELETE method");

  User.findByIdAndUpdate(req.params.userId, {$pull: {"posts": {_id: req.params.postId}}})
    .exec()
    .then(() => {
      res.redirect('/user/' + req.params.userId);
      console.log('This post has been removed from the database.');
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Why won\'t this shit delete?'});
    });
  })


//--------------------------- Favorites Page -------------------------------------------
router.get('/:id/my-favorites',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log('This is the favorites page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('my-favorites', user.profileUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Favorites page.'});
    });
})

//---------------------------- My-unique-posts Page ------------------------------------
router.get('/:id/whiskeys',
    passport.authenticate('jwt', {session: false}), function(req, res){
  console.log('This is the my-posts-unique page');

  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      res.render('my-posts-unique', user.profileUser());
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the Favorites page.'});
    });
})

//------------------------------ Account Delete Page ------------------------------------
router.get('/:id/delete-account',
    passport.authenticate('jwt', {session: false}), function(req, res){
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

router.post('/:id/delete-account',
    passport.authenticate('jwt', {session: false}), function(req, res){
  User.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.redirect('/');
      console.log('User has been removed from the database.');
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Why won\'t this shit delete?'});
    });
})

module.exports = router;




