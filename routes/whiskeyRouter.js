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
  console.log('whiskeyId: ' + req.params.whiskeyId);

  Whiskey
    .findById(req.params.whiskeyId)
    .exec()
    .then(single_whiskey => {
      // console.log('GET screen promise argument: ' + single_whiskey);
      //Look at single-post page GET route for passing user & whiskey to pug
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
  const userInput = req.body;

// Do we need to User.findById after 2nd then? or just construct the object in 1st or 2nd then, return that object as the argument for the next then, which will be the User.findById section.

  Whiskey.findById(req.params.whiskeyId)
    .then(doesntMatter => {
      const [whiskeyName, smallImageURL, largeImageURL] = [doesntMatter.whiskeyName,doesntMatter.smallImageURL, doesntMatter.largeImageURL];

      console.log('userInput.comment: ' + userInput.comment);

      return {
        // postID: ????????????????????????,
        whiskeyName: whiskeyName,
        smallImageURL: smallImageURL,
        largeImageURL: largeImageURL,
        rating: userInput.rating,
        favorite: false,
        comment: [{
          text: userInput.comment,
          // commentDate: Date.now
        }]
      };

    })
    .then(whiskeyInfo => {
      User
        .findByIdAndUpdate(req.params.userId, {$push: {"posts": {whiskeyName: whiskeyInfo.whiskeyName, smallImageURL: whiskeyInfo.smallImageURL, largeImageURL: whiskeyInfo.largeImageURL, rating: whiskeyInfo.rating, favorite: false, comment: whiskeyInfo.comment[0]}}})
        .exec()
        .then(user => {
          // console.log('user: ' + user.posts);
          console.log('whiskeyInfo.comment[0]: ' + whiskeyInfo.comment[0]);
          // console.log('whiskeyInfo.comment[0].commentDate: ' + whiskeyInfo.comment[0].commentDate);
          console.log('entire user with new post(?): ' + user);
          console.log('userInput.comment: ' + userInput.comment);
          // console.log('req.body stringify: ' + JSON.stringify(userInput));
      })})
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });

})

// .findByIdAndUpdate(req.params.userId, {$push: {"posts": {comment: userInput.comment}}})

// .findByIdAndUpdate(req.params.userId, {$push: {"posts": {whiskeyName: whiskeyInfo.whiskeyName, smallImageURL: whiskeyInfo.smallImageURL, largeImageURL: whiskeyInfo.largeImageURL, rating: whiskeyInfo.rating, favorite: false}}})

// ---------------------- Post Confirmation Screen --------------------------------------

   //Increment the postId here?
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


              //------------------- POST/PUT add to favorites --------------------------
//TODO - needs work!!!
router.post(':userId/post/:id/confirm', (req, res) => {
    let userInput = JSON.stringify(req.body);
    console.log(userInput);
  User
    .findById(req.params.userId)
    .exec()
    .then(user => {
      user.posts[postID].favorite === true
      res.render('post-history', user)
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

module.exports = router;
