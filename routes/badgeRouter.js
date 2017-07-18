const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Badge} = require('../models/badges');
// console.log(Badge);
// console.log(Badge.badges); //undefined, but allows page to be rendered in browser
// console.log(badges);  //"ReferenceError: badges is not defined"

router.get('/', (req, res) => {
  console.log("Does this GET request work?");
  console.log("type of: " + typeof badges);  //undefined - Badge = function
  Badge.find()
  .exec()

  //this still allows the page to be rendered to the browser, but throws an "Error: can't set headers after they are sent"  //gets correct data in Postman
  //Update - This works!!
    .then(badges => {
      res.render('badges', {
        badges: badges.map(
          (badge) => badge)
      });
    })

  //TypeError: badges.map is not a function
    // .then(res.render('badges', function(badges) {
    //   {printthistoscreen: badges.map(function(doesntmatter){
    //     doesntmatter})}
    // }))

    //this line works!  It renders Here is stuff to the browser:
    // .then(res.render('badges', {stuff: 'Here is stuff'}))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'No whiskeys for you!'});
    });
});

router.get('/:id', (req, res) => {
  Badge
    .findById(req.params.id)
    .exec()
    .then(badge => res.json(badge))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'No particular whiskey for you!'});
    });
});

module.exports = router;
