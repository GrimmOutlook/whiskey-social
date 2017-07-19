const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Whiskey} = require('../models/whiskeys');

router.get('/:id', (req, res) => {
  console.log(req.params.id);
  Whiskey
    .findById(req.params.id)
    // .find()
    // .limit(1)
    .exec()
    // .then(res.json(whiskeys))

    .then(whiskeys => {
      res.render('whiskey-profile', whiskeys)
      })


    // .then(
    //   whiskeys => res.render('whiskey-profile', whiskeys)[0]
    // )
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Something went terribly wrong!'});
    });
});

module.exports = router;
