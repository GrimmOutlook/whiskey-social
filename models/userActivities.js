const mongoose = require('mongoose');

const userActivitySchema = mongoose.Schema({
  userid: __id,
  myPosts: postID,
  myFriends: friendUserID,
  postCount: Number,
  uniquePostCount: Number,
  friendCount: Number,
  favoriteCount: Number,
  badgeCount: Number,
  badges: [String]
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = {UserActivity};
