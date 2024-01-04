const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   fullname: {
      type: String,
      required: true,
   },
   phoneNum: String,
   city: String,
   transactions: Array,
   role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
