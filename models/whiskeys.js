const mongoose = require('mongoose');

const whiskeySchema = mongoose.Schema({
  whiskeyName: {type: String, required: true},
  country: String,
  region: String,
  smallImageURL: {type: String, required: true},
  largeImageURL:  {type: String, required: true},
  description: {type: String, required: true}
});

const Whiskey = mongoose.model('Whiskey', whiskeySchema);

module.exports = {Whiskey};
