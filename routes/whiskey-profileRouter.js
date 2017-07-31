const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Whiskey} = require('../models/whiskeys');

// Get a single whiskey for the whiskey-profile screen --------------------------
router.get('/:id', (req, res) => {
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


//

module.exports = router;
