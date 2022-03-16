const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('post', PostSchema);
