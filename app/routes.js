const User = require('../app/models/users');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Whiskey = require('../app/models/whiskeys');
const whiskeyRouter = require('./whiskeyRouter');


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function(app, passport) {

    whiskeyRouter(app, passport);

// LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// User routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, (req, res) => {
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
    app.get('/post-history', isLoggedIn, (req, res) => {
      console.log('This is the post-history page');
      User
        .findOne({username: req.user.username})
        .exec()
        .then(user => {
          user.posts.reverse();
          res.render('post-history', user);
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something\'s wrong with the post-history page.'});
        });
    })

//--------------------------- Favorites Page -------------------------------------------
    app.get('/my-favorites', isLoggedIn, function(req, res){
      console.log('This is the favorites page');
      User
        .findOne({username: req.user.username})
        .exec()
        .then(user => {
          // user.profileUser().favoritePosts.reverse();
          res.render('my-favorites', user.profileUser());
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something\'s wrong with the Favorites page.'});
        });
    })

//---------------------------- My-unique-posts Page ------------------------------------
    app.get('/whiskeys', isLoggedIn, function(req, res){
      console.log('This is the my-posts-unique page');
      console.log(`req.user.username: ${req.user.username}`);
      console.log(`req.user._id: ${req.user._id}`);


      User
        .findOne({username: req.user.username})
        .exec()
        .then(user => {
          user.posts.reverse();
          res.render('my-posts-unique', user.profileUser());
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something\'s wrong with the Favorites page.'});
        });
    })

//---------------------------- Single Post Page -----------------------------------------
app.get('/single-post/:postId', isLoggedIn, function(req, res){
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
app.post('/single-post/:postId', isLoggedIn, function(req, res){
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
app.delete('/single-post/:postId', isLoggedIn, function(req, res){
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


// =============================================================================
// AUTHENTICATE (SIGNUP & LOGIN) ===============================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        app.get('/login', function(req, res) {
            res.render('login', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login',// redirect back to the signup page if there is an error
            failureFlash :  true// allow flash messages
        }));

        // SIGNUP =================================
        app.get('/signup', function(req, res) {
            req.flash('info', 'Flash is back!');
            res.render('signup', { message: req.flash('signupMessage') });
        });

                  //SIGNUP + SIGNUP TESTS WORK WITH JUST THIS CODE:
        app.post('/signup',  passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
          })
        );

};  // module.exports

