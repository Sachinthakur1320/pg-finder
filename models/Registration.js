const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  emailid:{
    type: String, 
    unique: true
  },
  name: String,
  password:{type: String},
  city: {
    type: String,
    trim: true,
  },
});
module.exports = mongoose.model('Registration', registrationSchema);