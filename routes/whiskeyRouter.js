const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const universalUserId = 5;

const {Whiskey} = require('../models/whiskeys');
const {User} = require('../models/users');

// --------------------------- Whiskey Profile screen --------------------------
router.get('/profile/:id', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .findById(req.params.id)
    .exec()
    .then(single_whiskey => {
      console.log("whiskey-profile info: " + single_whiskey);
      console.log("whiskey-profile whiskeyName: " + single_whiskey.whiskeyName);
      res.render('whiskey-profile', single_whiskey)
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

// ----------------------------- Whiskey Search Screen ----------------------------------

router.get('/search', (req, res) => {
  var searchTerm = req.query.whiskey;
  console.log(searchTerm);
  if (searchTerm){
    Whiskey
    .find({"whiskeyName": { $regex: searchTerm }})  // find is always an array
    .exec()
    .then(whiskeys => {
      console.log("This is what whiskey is returning: " + whiskeys);
      console.log("Print this whiskeyName to screen!!: " + whiskeys[0].whiskeyName);
      console.log(typeof(whiskeys));    //object - array
      res.render('whiskey-search', { whiskeys });  // This makes the array an object
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
  }
  else{
    res.render('whiskey-search');
  }
})

                  // Render more than one whiskey to search page

                  // .then(whiskeys => {
                  //       res.render('whiskey-search', {
                  //         whiskeys: whiskeys.map(
                  //           (whiskey) => whiskey)
                  //       });
                  //     })

// -------------------- Whiskey Post Screen ---------------------------------------------
         //GET the screen
router.get('/:userId/post/:whiskeyId', (req, res) => {
  console.log('userId: ' + req.params.userId);
  Whiskey
    .findById(req.params.whiskeyId)
    .exec()
    .then(single_whiskey => {
      res.render('whiskey-post', single_whiskey)
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});


//every route has hard-coded user in it!!!!!!!
          //POST info entered into screen into DB
router.post('/:userId/post/:whiskeyId', (req, res) => {
  //GET comment and rating from form:
    var userInput = JSON.stringify(req.body);
    console.log(userInput);

  //GET user id from hard-coded userId
  User
    .findById(req.params.userId)
    .exec()
    .then(user => {
      console.log('Here is user.username info.: ' + user.username);
      return user;
    })
    .then(
  //GET whiskey info from params.id  All info, including URLs?
      Whiskey
        .findById(req.params.whiskeyId)
        .exec()
        .then((single_whiskey, user) => {
          console.log('findById passed to fxn: ' + single_whiskey);
          console.log('Does user.posts make it down here? ' + user.posts);  //not now
          console.log('userInput: ' + userInput);
          res.render('post-confirm', single_whiskey)
          })
    )
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with POSTing a post.'});
    });
    //Determine updateable fields and how to update the User's posts array of objects



  //How do dates get entered into DB?
  //GET user from DB - How?
  //GET length of user.posts array, increment by 1, set that = postID
  //Push all info into user.posts array
  //separate push to user.posts.comment array?

})

// ---------------------- Post Confirmation Screen --------------------------------------
router.get('/post/:id/confirm', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .findById(req.params.id)
    .exec()
    .then(single_whiskey => {
      res.render('post-confirm', single_whiskey)
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

module.exports = router;
