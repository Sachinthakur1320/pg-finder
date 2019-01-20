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
  /*router.post('/login',function(req,res)
{
  var password=req.body.password;
  var emailid=req.body.emailid;

  Registration.findOne({emailid: emailid}, function(err,user)
  {
    if(emailid==='sachin@admin'&& password=='admin')
    {
      return res.send('admin');
    }
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
});*/

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

module.exports = router;