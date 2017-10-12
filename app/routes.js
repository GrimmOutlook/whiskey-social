const User = require('../app/models/users');
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
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

