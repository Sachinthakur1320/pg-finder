const express = require('express');
const mongoose=require('mongoose');
const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});
const { check, validationResult } = require('express-validator/check'); 
const router = express.Router();
const Registration = mongoose.model('Registration');
router.get('/', (req, res) => {
    res.render('layout',{users:""});
});
router.get('/login',(req,res)=>{
res.render('login');
});
router.get('/signup',(req,res)=>{
  res.render('signup');
  });
router.post('/login',function(req,res)
{
  var password=req.body.password;
  var emailid=req.body.emailid;

  Registration.findOne({emailid: emailid}, function(err,user)
  {
    if(err)
    {
      console.log(err);
      return res.status(500).send();
    }
    if(!user)
    {
      return res.status(404).send("SORRY YOU ARE NOT RECOGNISED!");
    }
    else
    {
      if(user.password!=req.body.password)
      {
return res.status(404).send("Invalid Pass");
      }
    }
    req.session.user=emailid;
    return res.render('dashboard',{users:""});
  })
});
router.post('/signup', function(req,res){
var name=req.body.name;
var password=req.body.password;
var emailid=req.body.emailid;
var city=req.body.city;

var newuser= new Registration();
newuser.name=name;
newuser.emailid=emailid;
newuser.password=password;
newuser.city=city;
newuser.save(function(err,savedUser){
if(err)
{
  console.log(err);
  return res.status(500).send();
}
return res.status(200).send("SUCCESSFULLY SUBMITTED YOUR REQUEST");
})
});
router.post('/',
[
  check('city')
  .isAlpha()
  .withMessage('Must be only alphabetical chars')
  .isLength({ min: 3 })
  .withMessage('Must be at least 3 chars long')
],
(req,res)=>{
var city=req.body.city;
var select=req.query.select;
const result = validationResult(req);
Registration.find({city: city}, function(err,foundData)
{
  if(err)
  {
    console.log(err);
 res.render('layout', {users: result.array()});
  }
  if(!foundData)
  {
    return res.status(404).send('NOT IN YOUR CITY YET!');
  }
  else
  {
    var responseObject=foundData;
    if(select && select == 'count')
    {
      responseObject={count : foundData.lenght};
    }
   return res.render('dashboard',{users:responseObject});
  }
})
});
router.get('/dashboard',function(req,res)
{
  if(!req.session.user)
  {
    return res.status(401).send();
  }
  return res.status(200).send("YOU ARE LOGGED IN");
})
router.get('/registrations', auth.connect(basic), (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('login', { title: 'Listing registrations', registrations });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});
module.exports = router;