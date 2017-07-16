const mongoose = require('mongoose');

const whiskeySchema = mongoose.Schema({
  title: {type: String, required: true},
  image_url: {type: String, required: true},
  description: {type: String, required: true}
});

const Whiskey = mongoose.model('Whiskey', whiskeySchema);

module.exports = {Whiskey};
