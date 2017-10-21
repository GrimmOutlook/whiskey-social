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
    app.get('/my-favorites', isLoggedIn, function(req, res){
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
    app.get('/whiskeys', isLoggedIn, function(req, res){
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
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        app.get('/signup', function(req, res) {
            req.flash('info', 'Flash is back!');
            res.render('signup', { message: req.flash('signupMessage') });
        });

        // BACKEND INPUT VALIDATION =================================
                // All required fields entered.
        // function missedField (jsonParser, req, res){
        //   const requiredFields = ['username', 'password'];
        //   const missingField = requiredFields.find(field => !(field in req.body));
        //   console.log(`missingField: ${missingField}`);
        //     if (missingField) {
        //       console.log(`res.status: missing field: ${res.status}`);
        //       return res.status(422).json({      // .send instead of .json??
        //         code: 422,
        //         reason: 'ValidationError',
        //         justforthehellofit: 'Look! Im in the res.body!',
        //         message: 'Missing field',
        //         location: missingField
        //       });
        //     }
        // }
        //         // All required fields are strings.
        // function areStrings (jsonParser, req, res){
        //   const stringFields = ['username', 'password'];
        //   const nonStringField = stringFields.find(field =>
        //     (field in req.body) && typeof req.body[field] !== 'string'
        //   );
        //   console.log('nonStringField: ' + nonStringField);

        //   if (nonStringField) {
        //     return res.status(422).json({
        //       code: 422,
        //       reason: 'ValidationError',
        //       flash: 'Must start with a letter!',
        //       message: 'Incorrect field type: expected string',
        //       location: nonStringField
        //     });
        //   }
        //   end();
        // }

        //         // Trim username & p/w
        // function trimUserPw (jsonParser, req, res){
        //   const explicityTrimmedFields = ['username', 'password'];
        //   const nonTrimmedField = explicityTrimmedFields.find(field => {
        //     console.log('field: ' + field);
        //     console.log('req.body[field]: ' + req.body[field]);
        //     req.body[field].trim() !== req.body[field]
        //   });

        //   if (nonTrimmedField) {
        //     return res.status(422).json({
        //       code: 422,
        //       reason: 'ValidationError',
        //       message: 'Cannot start or end with whitespace',
        //       location: nonTrimmedField
        //     });
        //   }
        // }

        app.post('/signup', jsonParser, (req, res) => {
          // BACKEND INPUT VALIDATION =================================
                // All required fields entered.
          const requiredFields = ['username', 'password'];
          const missingField = requiredFields.find(field => !(field in req.body));
          console.log(`missingField: ${missingField}`);
            if (missingField) {
              console.log(`res.status: missing field: ${res.status}`);
              return res.status(422).json({      // .send instead of .json??
                code: 422,
                reason: 'ValidationError',
                justforthehellofit: 'Look! Im in the res.body!',
                message: 'Missing field',
                location: missingField
              });
            }

                // All required fields are strings.
          const stringFields = ['username', 'password'];
          const nonStringField = stringFields.find(field =>
            (field in req.body) && typeof req.body[field] !== 'string'
          );
          console.log('nonStringField: ' + nonStringField);

          if (nonStringField) {
            return res.status(422).json({
              code: 422,
              reason: 'ValidationError',
              flash: 'Must start with a letter!',
              message: 'Incorrect field type: expected string',
              location: nonStringField
            });
          }

                // Trim username & p/w
          const explicityTrimmedFields = ['username', 'password'];
          const nonTrimmedField = explicityTrimmedFields.find(field =>
            req.body[field].trim() !== req.body[field]
          );

          console.log('nonTrimmedField: ' + nonTrimmedField);  //undefined?? Why??

          if (nonTrimmedField) {
            return res.status(422).json({
              code: 422,
              reason: 'ValidationError',
              message: 'Cannot start or end with whitespace',
              location: nonTrimmedField
            });
          }

                  // Reject username & password that are too short/long
          const sizedFields = {
            username: {min: 1, max: 72},
            password: {min: 10, max: 72}
          };

          const tooSmallField = Object.keys(sizedFields).find(field =>
            'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
          );
          const tooLargeField = Object.keys(sizedFields).find(field =>
            'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
          );

          if (tooSmallField || tooLargeField) {
            return res.status(422).json({
              code: 422,
              reason: 'ValidationError',
              message: tooSmallField ?
                `Must be at least ${sizedFields[tooSmallField].min} character(s) long` :
                `Must be at most ${sizedFields[tooLargeField].max} characters long`,
              location: tooSmallField || tooLargeField
            });
          }

          passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
          })
        });

};

