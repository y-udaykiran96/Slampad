const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
  googleID:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName:{
    type: String
  },
  lastName: {
    type: String
  },
  image:{
    type: String
  }
});

// export user model
module.exports = mongoose.model('users',userSchema);
