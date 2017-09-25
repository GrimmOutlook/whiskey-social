const mongoose = require('mongoose');

const whiskeySchema = mongoose.Schema({
  whiskeyName: String,
  country: String,
  region: String,
  smallImageURL: String,
  largeImageURL: String,
  description: String
});

const Whiskey = mongoose.model('Whiskey', whiskeySchema);

module.exports = {Whiskey};
