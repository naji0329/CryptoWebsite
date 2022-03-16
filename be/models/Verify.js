const mongoose = require('mongoose');

const VerifySchema = new mongoose.Schema({
  email: {
    type: String
  },
  phonenumber: {
    type: String
  },
  code: {
    type: String
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('verify', VerifySchema);
