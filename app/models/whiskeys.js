const mongoose = require('mongoose');
const Schema = mongoose.Schema

const whiskeySchema = Schema({
  whiskeyName: String,
  country: String,
  region: String,
  smallImageURL: String,
  largeImageURL: String,
  description: String
});

module.exports = mongoose.model('Whiskey', whiskeySchema);
