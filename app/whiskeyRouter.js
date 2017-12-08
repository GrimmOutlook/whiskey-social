const User = require('../app/models/users');
const Whiskey = require('../app/models/whiskeys');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = function(app, passport) {
    let searchTerm = "";

// ----------------------------- Whiskey Search Screen ----------------------------------

    app.get('/whiskey-search', isLoggedIn, (req, res) => {
      searchTerm = req.query.whiskey;
      console.log(searchTerm);
      req.session.searchTerm = searchTerm;
      if (searchTerm){
        Whiskey
            .find({"whiskeyName": { $regex: searchTerm, $options: '$i' }}) // find is always an array
            // .exec()
            .then(whiskeys => {
              console.log("This is what whiskeys is returning: " + whiskeys);
              // console.log("Print this whiskeyName to screen!!: " + whiskeys[0].whiskeyName);
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

// --------------------------- Whiskey Profile screen --------------------------
    app.get('/whiskey-profile/:whiskeyId', isLoggedIn, (req, res) => {
      console.log(req.params.whiskeyId);
      console.log('req.session.searchTerm: ' + req.session.searchTerm);
      Whiskey
        .findById(req.params.whiskeyId)
        .exec()
        .then(single_whiskey => {
          console.log("whiskey-profile info: " + single_whiskey);
          console.log("whiskey-profile whiskeyName: " + single_whiskey.whiskeyName);
          res.render('whiskey-profile', {"single_whiskey": single_whiskey, "searchTerm": req.session.searchTerm});
          })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Something went terribly wrong!'});
        });
    });

// -------------------- Whiskey Post Screen ---------------------------------------------
         //GET the screen
  app.get('/post/:whiskeyId', isLoggedIn, (req, res) => {
    console.log('userId: ' + req.user._id);
    console.log('whiskeyId: ' + req.params.whiskeyId);

    Whiskey
      .findById(req.params.whiskeyId)
      .exec()
      .then(single_whiskey => {

        // {"user": dummyId, "item": item}
        //Look at single-post page GET route for passing user & whiskey to pug

        res.render('whiskey-post', {"user": req.user._id, "single": single_whiskey});
        })
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Something went terribly wrong!'});
      });
  });

            //POST info entered into screen into DB
  app.post('/post/:whiskeyId', isLoggedIn, (req, res) => {
     console.log('whiskey-post POST userId: ' + req.user._id);
    console.log('whiskey-post POST whiskeyId: ' + req.params.whiskeyId);
    console.log(`req.body: ${req.body}`);
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
          .findByIdAndUpdate(req.user._id, {$push: {"posts": {whiskeyName: whiskeyInfo.whiskeyName, smallImageURL: whiskeyInfo.smallImageURL, largeImageURL: whiskeyInfo.largeImageURL, rating: whiskeyInfo.rating, favorite: false, comment: whiskeyInfo.comment[0]}}})
          .exec()
          .then(user => {
            console.log('whiskeyInfo.comment[0]: ' + whiskeyInfo.comment[0]);
            console.log('entire user with new post(?): ' + user);
            console.log('userInput.comment: ' + userInput.comment);
            res.redirect('/post/' + req.user._id + '/confirm');
        })})
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Something went terribly wrong!'});
      });

  })

// ---------------------- Post Confirmation Screen --------------------------------------
  app.get('/post/:userId/confirm', isLoggedIn, (req, res) => {
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
  app.post('/post/:userId/confirm', isLoggedIn, (req, res) => {
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
        res.redirect('/profile');
      })
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Something went terribly wrong!'});
      });
  });

}
