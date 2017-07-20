const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userid: userid,
  title: whiskeysID,
  image_url: whiskeysID,
  rating: Number,
  likesCount: Number,
  favorite: Boolean,
  comment: [{
    author: userid,
    text: [String],
    replies: [{
      author: userid,
      text: [String]
    }]
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};
