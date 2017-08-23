const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const userSchema = Schema({
  // firstName: {type: String},// required: true, trim: true},
  // lastName: {type: String, required: true, trim: true},
  password: {type: String, required: true},
  username: {type: String, required: true, trim: true},
  // email: {type: String, required: true, trim: true},
  // avatar: Buffer,  //TODO nice to have  -  twitter or FBook photo

  postCount: Number,  //Or just use post.length in model or router?
  uniquePostCount: Number,
  favoriteCount: Number,

  posts: [{
    postID: Number,
    title: String,  // from whiskey schema
    image_url: String,
    postDate: {type: Date, default: Date.now},
    rating: Number,
    favorite: Boolean,
    // unique: Boolean,  ????????????
    comment: [{
      text: [String],
      commentDate: {type: Date, default: Date.now},
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
    favoriteCount: this.favoriteCount,
    // avatar: this.avatar
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


