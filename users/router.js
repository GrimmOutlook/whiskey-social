'use strict';
const {User} = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Whiskey = require('../whiskeys/models');        // necessary?
const whiskeyRouter = require('../whiskeys/router');  // necessary?

const router = express.Router();

const jsonParser = bodyParser.urlencoded();   // works in browser, not Postman
// const jsonParser = bodyParser.json();      // works in Postman, not browser

// passport.use(localStrategy);
// passport.use(jwtStrategy);

const {router: authRouter, jwtStrategy} = require('../auth');
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });


// route middleware to ensure user is logged in - CAN I USE SOMETHING SIMILAR WITH JWT?
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//     res.redirect('/');
// }

// module.exports = function(app, passport) {  // no longer needed with router instead of app

    // whiskeyRouter(app, passport);

// root route for homepage - not a protected endpoint
router.get('/', function(req, res) {
  res.render('index');
});

// SIGNUP ==============================

router.get('/signup', (req, res) => {
  res.render('signup');
});

//--------------------- Post to register a new user -----------------------------------------
router.post('/signup', jsonParser, (req, res) => {
  console.log('req.body', req.body);
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// User routes ===============================================================

    // PROFILE SECTION =========================
    router.get('/profile', (req, res) => {
        console.log('req.body: ' + JSON.stringify(req.body));
        console.log(`req.user: ${req.user}`);
        console.log(`req.user.username: ${req.user.username}`);
      User
        .findOne({username: req.user.username})
        .exec()
        .then(user => {
          res.render('profile', user.profileUser());
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something\'s wrong with the profile page.'});
        });
    });

//--------------------- Post-History Page -----------------------------------------
    router.get('/post-history', (req, res) => {
      console.log('This is the post-history page');
      User
        .findOne({username: req.user.username})
        .exec()
        .then(user => {
          console.log('example of history page pass to pug: ' + user);
          res.render('post-history', user);
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something\'s wrong with the post-history page.'});
        });
    })

//--------------------------- Favorites Page -------------------------------------------
    router.get('/my-favorites', function(req, res){
      console.log('This is the favorites page');
      User
        .findOne({username: req.user.username})
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
    router.get('/whiskeys', function(req, res){
      console.log('This is the my-posts-unique page');
      console.log(`req.user.username: ${req.user.username}`);
      console.log(`req.user._id: ${req.user._id}`);


      User
        .findOne({username: req.user.username})
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

//---------------------------- Single Post Page -----------------------------------------
router.get('/single-post/:postId', function(req, res){
  console.log('This is the single-post page');
  console.log(`req.params.postId: ${req.params.postId}`);
  const postIdIncoming = req.params.postId;


  User
    .findOne({username: req.user.username})
    .exec()
    .then(user => {
      user.posts.find(function(item){
        console.log('This is the post: ' + item);
        console.log(`item._id: ${item._id}`);
        console.log(`postIdIncoming: ${postIdIncoming}`);
        if (item._id == postIdIncoming){
          console.log('This is the object going to pug: ' + JSON.stringify(user));
          res.render('single-post', item);
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
router.post('/single-post/:postId', function(req, res){
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
    .findOne({username: req.user.username})
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
      res.redirect('/single-post/' + req.params.postId);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something\'s wrong with updating DB.'});
    });

})

             //--------- DELETE method for deleting entire post -------------------
router.delete('/single-post/:postId', function(req, res){
  console.log("Hey this is the DELETE method");
  console.log(`req.params.postId: ${req.params.postId}`);
  console.log(`req.user.username: ${req.user.username}`);

  User.update({username: req.user.username}, {$pull: {"posts": {_id: req.params.postId}}})
    .exec()
    .then(() => {
      res.redirect('/profile');
      console.log('This post has been removed from the database.');
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Why won\'t this shit delete?'});
    });
  })


module.exports = {router};


