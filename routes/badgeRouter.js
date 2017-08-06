const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Badge} = require('../models/badges');

router.get('/', (req, res) => {
  console.log("Does this GET request work?");
  console.log("type of: " + typeof badges);
  Badge.find()
  .exec()
  .then(badges => {
    res.render('badges', {
      badges: badges.map(
        (badge) => badge)
    });
  })
  .catch(
    err => {
      console.error(err);
      res.status(500).json({message: 'No whiskeys for you!'});
  });
});

module.exports = router;
