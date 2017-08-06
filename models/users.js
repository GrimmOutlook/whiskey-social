const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  password: {type: String, required: true},
  username: {type: String, required: true, trim: true}    //,
  // email: {type: String, required: true, trim: true},
  // avatar: Buffer,  //TODO nice to have  -  twitter or FBook photo

  // myFriends: [Schema.Types.ObjectId],

  // postCount: Number,
  // uniquePostCount: Number,
  // friendCount: Number,
  // favoriteCount: Number,
  // badgeCount: Number,
  // badges: [String],

  // post: [{
  //   postID: Number,
  //   title: String,
  //   image_url: String,
  //   postDate: {type: Date, default: Date.now},
  //   rating: Number,
  //   likesCount: Number,
  //   favorite: Boolean,
  //   unique: Boolean,  ????????????
  //   comment: [{
  //     author: Schema.Types.ObjectId,
  //     text: [String],
  //     commentDate: {type: Date, default: Date.now},
  //     replies: [{
  //       author: Schema.Types.ObjectId,
  //       text: [String],
  //       replyDate: {type: Date, default: Date.now}
  //     }]
  //   }]
  // }]

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

userSchema.methods.formattedUser = function() {
  console.log('formattedUser: ' + this);
  return {
    id: this._id,
    name: this.fullName,
    username: this.username,
    message: "This went into the DB"
    // email: this.email
  };
}

userSchema.methods.profileUser = function() {
  console.log('profileUser: ' + this);
  return {
    id: this._id,
    name: this.fullName,
    username: this.username,
    postCount: this.postCount,
    uniquePostCount: this.uniquePostCount,
    friendCount: this.friendCount,
    favoriteCount: this.favoriteCount,
    badgeCount: this.badgeCount,
    badges: this.badges  // an array of strings
    // avatar: this.avatar
  };
}


const User = mongoose.model('User', userSchema);

module.exports = {User};


