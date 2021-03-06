var models = require('../models/user');
module.exports = function(app,passport) {
    

    app.get(['/','/home'], function(req, res) {
        res.render('index',{user:req.user});
    });


    app.get('/signin',(req,res)=>{
        if(!req.user)
            res.render('signin');
        else
            res.redirect('/',{user:req.user});
    });
    app.get('/signup',(req,res)=> {
        res.render('signup',{user:req.user});
    });

    app.get('/findroom', (req,res)=> {
        res.render('findroom',{user:req.user});
    });
    app.post('/findroom',(req,res)=>{
        var location=req.body.location;
        // var query={city:location};
        // var results=models.Room.find(query);
        models.getpgbylocation(location,function(err,results){
            console.log("*******");
            console.log(results);
            res.render('findroom',{user:req.user,results:results});
        })
        
        
        
    })
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile',{user : req.user});
    });

    app.get('/updateprofile', isLoggedIn, function(req, res) {
        res.render('updateprofile',{user : req.user});
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/postroom', (req,res)=>{
        if(req.user)
            res.render('postroom',{user: req.user});
        else
            res.redirect('/signup');
            
    }); 
    
    // app.get('/auth/facebook', passport.authenticate('facebook', {
    //     scope: ['public_profile', 'email', 'user_birthday','user_likes']
    // }));

    // app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    //     successRedirect: '/test',
    //     failureRedirect: '/'
    // }));

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    app.post('/signin', passport.authenticate('local-login', {
            successRedirect : '/',
            failureRedirect : '/signin',
            failureFlash : true
    }));
    app.post('/postroom',(req,res)=>{
        var rooms=models.Room();
        console.log(req.body);
        rooms.userid=req.user._id;
        rooms.pgname=req.body.pgname;
        rooms.roomfor=req.body.roomfor;
        rooms.doorno=req.body.doorno;
        rooms. saddress=req.body.saddress;
        rooms.city=req.body.city;
        rooms.state=req.body.state;
        rooms.zipcode=req.body.zipcode;
        rooms.pgphoneno=req.body.pgphoneno;
        rooms.roomtype=req.body.roomtype;
        rooms.rent = req.body.rent;
        rooms.deposit=req.body.deposit;
        rooms.amenities = req.body.amenities;
  
        rooms.save();
        //var data=new rooms(req.body);
        //data.save().then(item=>{res.send("item saved");})
        //.catch(err=>{res.status(400).send("unable to save");});




        res.redirect('/');
    })

    app.post('/',function(req,res){
        res.render('showrooms',{user:req.user});
    })

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

String.prototype.initCap = function () {
   return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
};