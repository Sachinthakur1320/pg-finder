const express = require('express');
const path = require('path');
const mongoose=require('mongoose');
const passport=require('passport');
const router = express.Router();
const Registration = mongoose.model('Registration');
const Pg_Registration = mongoose.model('Pg_Registration');
const multer=require('multer');
const storage=multer.diskStorage({
  destination: function(req,file,cb)
  {
cb(null,'./public/uploads')
  },
  filename: function(req,file,cb)
  {
    cb(null,new Date().toISOString() + file.fieldname+path.extname(file.originalname));
  },
  fileFilter: function(req,file,cb){
    if(!file.mimetype.match(/jpe||jpg||png||jpeg||gif$i/))
    {
      cb(new Error('File is not supported'), false);
    }
    cb(null,true);
  }
});
const upload= multer({storage:storage});
router.get('/profile',isLoggedIn,(req,res)=>{
  res.render('profile');
});
router.get('/login',(req,res)=>{
  var messages=req.flash('error');
res.render('login',{massages: messages,hasErrors: messages.length>0});
});

router.get('/signup',(req,res)=>{
  res.render('signup');
  });
  router.get('/pg_signup',(req,res)=>
  {
  res.render('pg_signup');
  });
  router.post('/login',passport.authenticate('local.login', {
    successRedirect: '/user/profile',
    failureRedirect: '/login',
    failureFlash:true
  }));
  
router.post('/signup',upload.any(),function(req,res){
    var messages = [];
    var a=req.body.password.length;
    Registration.findOne({emailid : req.body.emailid},function(err,user){
      if(user){
          messages.push({msg : 'Email already in use'});
      }
      if(a<6)
      {
      messages.push({msg : 'Password at least will be 6 character'});
      }
      if(messages.length>0){
    res.render('signup',{messages:messages});
      }
      else{
    var name=req.body.name;
    var password=req.body.password;
    var emailid=req.body.emailid;
    var city=req.body.city;
    
    var newuser= new Registration();
    newuser.name=name;
    newuser.emailid=emailid;
    newuser.password=newuser.encryptPassword(password);
    newuser.city=city;
    newuser.save(function(err,savedUser){
    if(err)
    {
      console.log(err);
      return res.status(500).send();
    }
    return res.redirect('login');
    })
    }
    });
    });
     
router.post('/pg_signup',upload.any(),function(req,res){
  var messages = [];
  var a=req.body.password.length;
  Pg_Registration.findOne({emailid : req.body.emailid},function(err,user){
    if(user){
        messages.push({msg : 'Email already in use'});
    }
    if(a<6)
    {
    messages.push({msg : 'Password at least will be 6 character'});
    }
    if(messages.length>0){
  res.render('signup',{messages:messages});
    }
    else{
  var name=req.body.name;
  var password=req.body.password;
  var emailid=req.body.emailid;
  var city=req.body.city;
  var image1=req.file.pic1;
  var image2=req.file.pic2;
  var image3=req.file.pic3;
  var image4=req.file.pic4;
console.log(image1);
  var newuser= new Pg_Registration();
  newuser.name=name;
  newuser.emailid=emailid;
  newuser.password=newuser.encryptPassword(password);
  newuser.city=city;
  newuser.imageurl1=image1;
  newuser.imageurl2=image2;
  newuser.imageurl3=image3;
  newuser.imageurl4=image4;
  newuser.save(function(err,savedUser){
  if(err)
  {
    console.log(err);
    return res.status(500).send();
  }
  return res.redirect('login');
  })
  }
  });
  });
    router.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/');
        });
        module.exports = router; 

function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/');
}
