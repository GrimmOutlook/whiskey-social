const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {String, required: true, trim: true},
  lastName: {String, required: true, trim: true},
  password: {type: String, required: true},
  userName: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true}
});


userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.formattedUser = function() {
  console.log(this);
  return {
    id: this._id,
    name: this.fullName,
    userName: this.userName,
    email: this.email
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


