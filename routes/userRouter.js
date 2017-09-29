const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const {LocalStrategy} = require('passport-local');
// const passport = require('passport');

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const {User} = require('../models/users');
const {Whiskey} = require('../models/whiskeys');
const dummyId = "59c86f3490ae9e8f182a7e8e";

// router.use(jsonParser);

// passport.use(LocalStrategy);
// router.use(passport.initialize());

//--------------------------- Profile Page ---------------------------------------------
router.get('/:id', function(req, res){
  console.log('This is the Profile page');
  console.log('req.params.id: ' + req.params.id);

// User
//     .findByIdAndUpdate(req.params.userId,)

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
router.get('/:id/post-history', function(req, res){
  console.log('This is the post-history page');
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      //just get the whole user and use pug to render what is needed for display
      res.render('post-history', user);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the post-history page.'});
    });
})

//---------------------------- Single Post Page -----------------------------------------
router.get('/:id/single-post/:postID', function(req, res){
  console.log('This is the single-post page');
  // console.log("userId: " + req.params.id);
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      user.posts.find(function(item){
        // console.log('This is the postID: ' + item);
        if (item.postID == req.params.postID){
          // console.log('This is the object going to pug: ' + JSON.stringify({"user":dummyId, "item":item}));
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

             //--------- PUT method for modifying comment & rating ----------------
router.post('/:userId/single-post/:postId', function(req, res){
  const userInput = req.body;

  // if (Object.keys(req.body) === "text"){}

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
  const inner = "posts.3.comment";

  User.findById(req.params.userId)
    .then(user => {
      user.posts.find(function(item){
        if (item.postID == req.params.postId){
          console.log('user: ' + user);
          console.log('user.posts: ' + user.posts);
          console.log('user.posts[postIdIndex]: ' + user.posts[postIdIndex]);
          // item.comment.push(toUpdate);

          user.posts[postIdIndex].update(req.params.userId, {$push: {"comment": {text: toUpdate.text}}});

          res.redirect('/user/' + req.params.userId + '/single-post/' + req.params.postId)
        }
      })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with the single-post page.'});
    });





  // User
  //   .findByIdAndUpdate(req.params.userId, {"posts.postId":  3}, {$push: {"posts.$.comment": {text: toUpdate.text}}})
  //   .then(user =>
  //     res.redirect('/user/' + req.params.userId + '/single-post/' + req.params.postId))
  //   .catch(
  //     err => {
  //       console.error(err);
  //       res.status(500).json({message: 'Something\'s wrong with updating DB.'});
  //   });
   // db.users.update({_id : ObjectId("59c86f3490ae9e8f182a7e8e")}, {$push: {"posts.4.comment": {text: "testing"}}})


})

             //--------- DELETE method for deleting entire post -------------------
  // else{
    // Find post and delete it.
  // }


//--------------------------- Favorites Page -------------------------------------------
router.get('/:id/my-favorites', function(req, res){
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
router.get('/:id/whiskeys', function(req, res){
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




