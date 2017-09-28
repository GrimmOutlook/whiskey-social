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
  console.log("userId: " + req.params.id);
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      // console.log(req.params.postID);  //this works
      //console.log("Post Length:"+user.posts.length);
      //TODO Rewrite with find instead of filter:
      user.posts.find(function(item){
        console.log('This is the postID: ' + item);
        if (item.postID == req.params.postID){
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

             //--------- PUT method for modifying comment & rating ----------------
router.post('/:userId/single-post/:postId', function(req, res){
  const userInput = req.body;

  // if (Object.keys(req.body) === "text"){}

  console.log('req.body Object.keys: ' + Object.keys(req.body));
  console.log('req.body: ' + req.body);
  console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body));
  console.log('User Input: ' + userInput);
  console.log("userId: " + req.params.userId);//
  console.log("postId: " + req.params.postId);//
  const toUpdate = {};
  const updateableFields = ['text'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      console.log('field: ' + field);
      console.log('userInput[field]: ' + userInput[field]);//
      console.log('userInput.field: ' + userInput.field);
      console.log('userInput: ' + userInput);
        toUpdate[field] = req.body[field];
        console.log('This is toUpdate[field] in the if statement: ' + toUpdate[field]);
        // res.render('post-confirm', toUpdate);
      }
      else {
        console.log('Error message: field isn\'t in req.body');
      }
  });

  console.log('toUpdate.text after forEach loop: ' + toUpdate.text);//
  console.log('toUpdate after forEach loop: ' + toUpdate);
  // const currentDate = Date.now;

  const postIdIndex = parseInt(req.params.postId) - 1;

// { _id: "iL9hL2hLauoSimtkM", "comments._id": "id1"},
//   { $push: { "comments.$.likes": "userID3" }}
  console.log('postIdIndex: ' + postIdIndex);
  const inner = "posts.3.comment";

// "_id" : ObjectId("59c86f3490ae9e8f182a7e8e")
// $push: {'devices' : {'id': deviceID, 'name':deviceName}}

  User
    .findByIdAndUpdate(req.params.userId, {"posts.postId":  3}, {$push: {"posts.$.comment": {text: toUpdate.text}}})
    .then(user =>
      res.redirect('/user/' + req.params.userId + '/single-post/' + req.params.postId))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with updating DB.'});
    });
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




