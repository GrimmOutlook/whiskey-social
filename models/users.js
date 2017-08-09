const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const userSchema = Schema({
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  password: {type: String, required: true},
  username: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  // avatar: Buffer,  //TODO nice to have  -  twitter or FBook photo

  // myFriends: [String],
  myFriends: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  postCount: Number,  //Or just use post.length in model or router?
  uniquePostCount: Number,
  friendCount: Number,  //Or just use myFriends.length in model or router?
  favoriteCount: Number,
  badgeCount: Number,  //Or just use badges.length in model or router?
  badges: [String],

  post: [{
    postID: Number,
    title: String,
    image_url: String,
    postDate: {type: Date, default: Date.now},
    rating: Number,
    likesCount: Number,
    favorite: Boolean,
    // unique: Boolean,  ????????????
    comment: [{
      author: { type: Schema.Types.ObjectId, ref: 'User' },  //Or use String?
      text: [String],
      commentDate: {type: Date, default: Date.now},
      replies: [{
        author: { type: Schema.Types.ObjectId, ref: 'User' },  //Or use String?
        text: [String],
        replyDate: {type: Date, default: Date.now}
      }]
    }]
  }]

});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

//use a virtual(s) to replace Counts??

userSchema.methods.formattedUser = function() {
  // console.log('formattedUser: ' + this);
  return {
    id: this._id,
    name: this.fullName,
    username: this.username,
    email: this.email
    // message: "This went into the DB"
  };
}

userSchema.methods.profileUser = function() {
  // console.log('profileUser: ' + this);
  return {
    id: this._id,
    name: this.fullName,
    username: this.username,
    postCount: this.postCount,
    uniquePostCount: this.uniquePostCount,
    friendCount: this.friendCount,
    myFriends: this.myFriends,
    favoriteCount: this.favoriteCount,
    badgeCount: this.badgeCount,
    badges: this.badges  // an array of strings
    // avatar: this.avatar
  };
}

userSchema.virtual('friendToString').get(function() {
  let objToString = [];
  console.log((this.myFriends).length); //why isn't this.myFriends an array?!
  this.myFriends.forEach(function(element) {
    objToString.push(element.toString());
    console.log('objToString so far: ' + objToString);
  });
  console.log('objToString output: ' + objToString);
  return objToString;
});

userSchema.methods.friendsOfUser = function() {
  // console.log('friendToString output: ' + this.friendToString);
  return {
    id: this._id,
    friends: this.friendToString
  };
}


const User = mongoose.model('User', userSchema);

module.exports = {User};


