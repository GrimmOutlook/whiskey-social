const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Whiskey} = require('../models/whiskeys');

// Get a single whiskey for the whiskey-profile screen --------------------------
router.get('/profile/:id', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .findById(req.params.id)
    .exec()
    .then(single_whiskey => {
      res.render('whiskey-profile', single_whiskey)
      })
    // .then(single_whiskey => {res.json(single_whiskey)})
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

// Get first 10 whiskeys by closest match when searched for -----------------------------
router.get('/search', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .find()
    .exec()
    .then(whiskeys => {
      res.render('whiskey-search', {
        whiskeys: whiskeys.map(
          (whiskey) => whiskey)
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

// Post Screen for a single whiskey  -----------------------------------------------------
router.get('/post/:id', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .findById(req.params.id)
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

// Post Confirmation Screen for a user whiskey post --------------------------------------
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

// Single-Post Screen for a single whiskey post w/rating, likes, comments, etc. --------
// router.get('/post/:postID', (req, res) => {
//   console.log(req.params.id);
//   Whiskey
//     .findById(req.params.id)
//     .exec()
//     .then(single_whiskey => {
//       res.render('single-post', single_whiskey)
//       })
//     .catch(
//       err => {
//         console.error(err);
//         res.status(500).json({message: 'Something went terribly wrong!'});
//     });
// });

module.exports = router;
