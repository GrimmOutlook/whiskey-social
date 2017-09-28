const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

// avatar: Buffer,  //TODO nice to have  -  twitter or FBook photo
const userSchema = Schema({
  firstName: {type: String, trim: true},
  lastName: {type: String, trim: true},
  password: String,
  username: {type: String, trim: true},
  email: {type: String, trim: true},
  posts: [{
    postID: Number,
    whiskeyName: String,     // from whiskey schema
    smallImageURL: String,   // from whiskey schema
    largeImageURL: String,   // from whiskey schema
    postDate: {type: Date, default: Date.now},
    rating: Number,
    favorite: Boolean,
    comment: [{
      text: String,
      commentDate: {type: Date, default: Date.now}
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
  let postCount = this.posts.length;
  let favoriteCount = 0;
  let favoriteNames = [];  // array used to filter out duplicate favorites
  let favoritePosts = [];
  let unique = []; // array used to determine uniquePostCount
  let uniquePosts = [];

  if (this.posts.length > 0){
    for (let f = 0; f < this.posts.length; f++){
      if ((this.posts[f].favorite === true) && (favoriteNames.includes(this.posts[f].whiskeyName) === false)){
        favoriteCount++;
        favoriteNames.push(this.posts[f].whiskeyName);
        favoritePosts.push(this.posts[f]);
      }
    }
  }

  if (this.posts.length > 0){
    for (let w = 0; w < this.posts.length; w++){
      if (unique.includes(this.posts[w].whiskeyName) === false){
        unique.push(this.posts[w].whiskeyName);
        uniquePosts.push(this.posts[w]);
      }
    }
  }
  let uniquePostCount = unique.length;

  return {
    id: this._id,
    name: this.fullName,
    username: this.username,
    postCount: postCount,
    favoriteCount: favoriteCount,
    favoritePosts: favoritePosts,
    uniquePostCount: uniquePostCount,
    uniquePosts: uniquePosts
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


