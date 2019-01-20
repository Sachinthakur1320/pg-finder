const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
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
const pg_registrationSchema = new mongoose.Schema({
  emailid:{
    type: String, 
    unique: true
  },
  name: String,
  password: String,
  city: {
    type: String,
    trim: true,
  },
  imageurl1: String,
  imageurl2: String,
  imageurl3: String,
  imageurl4: String
});
registrationSchema.methods.encryptPassword=function(password){
return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};

pg_registrationSchema.methods.validPassword=function(password){
return bcrypt.compareSync(password,this.password);
};
pg_registrationSchema.methods.encryptPassword=function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
  };
  
registrationSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.password);
  };
module.exports = mongoose.model('Registration', registrationSchema);
module.exports = mongoose.model('Pg_Registration', pg_registrationSchema);