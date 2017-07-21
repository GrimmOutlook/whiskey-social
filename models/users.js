const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    {firstName: String, required: true, trim: true},
    {lastName: String, required: true, trim: true}
  },
  password: {
    type: String,
    required: true
  },
  userName: {type: String, required: true, trim: true},
  dob: {
    {month: type: Number, required: true},
    {day: type: Number, required: true},
    {year: type: Number, required: true}
  },
  email: {type: String, required: true, trim: true}
});


userSchema.virtual('fullName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`;
});

userSchema.methods.formattedUser = function() {
  console.log(this);
  return {
    id: this._id,
    name: this.fullName,
    userName: this.userName,
    dob: this.dob,
    email: this.email
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};


