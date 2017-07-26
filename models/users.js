const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  // firstName: {type: String, required: true, trim: true},
  // lastName: {type: String, required: true, trim: true},
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
  //   title: String,
  //   image_url: String,
  //   postDate: {date: Date.now()},
  //   rating: Number,
  //   likesCount: Number,
  //   favorite: Boolean,
  //   comment: [{
  //     author: Schema.Types.ObjectId,
  //     text: [String],
  //     commentDate: {date: Date.now()},
  //     replies: [{
  //       author: Schema.Types.ObjectId,
  //       text: [String],
  //       replyDate: {date: Date.now()}
  //     }]
  //   }]
  // }]

});

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.formattedUser = function() {
  console.log(this);
  return {
    id: this._id,
    // name: this.fullName,
    username: this.username,
    message: "This went into the DB"
    // email: this.email
  };
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


