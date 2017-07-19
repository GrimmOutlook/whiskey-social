const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String
  },
  password: {
    type: String,
    required: true
  },
  userName: {type: String, required: true},
  dob: {type: String, required: true},
  email: {type: String, required: true},
  //----------------------model - userActivity.js refers back to user id -------------
  postCount: Number,
  uniquePostCount: Number,
  friendCount: Number,
  favoriteCount: Number,
  badgeCount: Number,
  badges: [String]
});


userSchema.virtual('fullName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`; //trim()
});

userSchema.methods.formattedUser = function() {
  console.log(this);
  return {
    id: this._id,
    name: this.fullName,
    userName: this.userName,
    dob: this.dob,
    email: this.email,
    postCount: this.postCount,
    uniquePostCount: this.uniquePostCount,
    friendCount: this.friendCount,
    favoriteCount: this.favoriteCount,
    badgeCount: this.badgeCount,
    badges: this.badges
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


