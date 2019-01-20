var passport=require('passport');
var Registration=require('../models/Registration');
var LocalStrategy=require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
done(null,user.id)
});
passport.deserializeUser((id,done)=>{
Registration.findById(id,function(err,user){
   done(err,user);
});
});

passport.use('local.login',new LocalStrategy({
usernameField: 'emailid',
passwordField: 'password',
passReqToCallback: true
},function(req,emailid,password,done){
Registration.findOne({'emailid': emailid},function(err,user){
if(err){
   return done(err);
}
if(!user){
   return done(null,false,{message:'Email not recognise'});
}
if(user){
var realuser=user.validPassword(password);
console.log(realuser);
if(realuser)
{
return done(null,user);
}
else
{
return done(null,false,{message:'password not recognise'})
}
}
})
}));