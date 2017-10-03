const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const dummyId = "59ceaae756bbb5507df5d765";

const {Whiskey} = require('../models/whiskeys');
const {User} = require('../models/users');

// --------------------------- Whiskey Profile screen --------------------------
router.get('/profile/:whiskeyId', (req, res) => {
  console.log(req.params.whiskeyId);
  Whiskey
    .findById(req.params.whiskeyId)
    .exec()
    .then(single_whiskey => {
      console.log("whiskey-profile info: " + single_whiskey);
      console.log("whiskey-profile whiskeyName: " + single_whiskey.whiskeyName);
      res.render('whiskey-profile', {"user": dummyId, "single": single_whiskey});
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
    .find({"whiskeyName": { $regex: searchTerm, $options: '$i' }}) // find is always an array
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

// -------------------- Whiskey Post Screen ---------------------------------------------
         //GET the screen
router.get('/:userId/post/:whiskeyId', (req, res) => {
  console.log('userId: ' + req.params.userId);
  console.log('whiskeyId: ' + req.params.whiskeyId);

  Whiskey
    .findById(req.params.whiskeyId)
    .exec()
    .then(single_whiskey => {

      // {"user": dummyId, "item": item}
      //Look at single-post page GET route for passing user & whiskey to pug

      res.render('whiskey-post', {"user": dummyId, "single": single_whiskey});
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

          //POST info entered into screen into DB
router.post('/:userId/post/:whiskeyId', (req, res) => {
  //comment and rating from form:
  const userInput = req.body;

  Whiskey.findById(req.params.whiskeyId)
    .then(doesntMatter => {
      const [whiskeyName, smallImageURL, largeImageURL] = [doesntMatter.whiskeyName,doesntMatter.smallImageURL, doesntMatter.largeImageURL];

      return {
        whiskeyName: whiskeyName,
        smallImageURL: smallImageURL,
        largeImageURL: largeImageURL,
        rating: userInput.rating,
        favorite: false,
        comment: [{
          text: userInput.comment
        }]
      };

    })
    .then(whiskeyInfo => {
      User
        .findByIdAndUpdate(req.params.userId, {$push: {"posts": {whiskeyName: whiskeyInfo.whiskeyName, smallImageURL: whiskeyInfo.smallImageURL, largeImageURL: whiskeyInfo.largeImageURL, rating: whiskeyInfo.rating, favorite: false, comment: whiskeyInfo.comment[0]}}})
        .exec()
        .then(user => {
          console.log('whiskeyInfo.comment[0]: ' + whiskeyInfo.comment[0]);
          console.log('entire user with new post(?): ' + user);
          console.log('userInput.comment: ' + userInput.comment);
          res.redirect('/whiskey/post/' + req.params.userId + '/confirm');
      })})
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });

})

// ---------------------- Post Confirmation Screen --------------------------------------
router.get('/post/:userId/confirm', (req, res) => {
  console.log(req.params.userId);
  User
    .findById(req.params.userId)
    .exec()
    .then(user => {
      console.log(`comment most recent: ${user.posts[user.posts.length-1].comment[0].text}`);
      res.render('post-confirm', user)
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});


              //------------------- POST/PUT add to favorites --------------------------
router.post('/post/:userId/confirm', (req, res) => {
  console.log(`req.params.userId ${req.params.userId}`);
  User
    .findById(req.params.userId)
    .exec()
    .then(user => {
      console.log('current post: ' + user.posts[user.posts.length-1]);

      user.posts[user.posts.length-1].favorite = true;
      return user.save();
    })
    .then(user => {
      res.redirect('/user/' + req.params.userId);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

module.exports = router;













