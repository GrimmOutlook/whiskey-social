const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  badgePhoto: {type: String, required: true}
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = {Badge};


