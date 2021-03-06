var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy    = require('passport-local').Strategy;

var Promise          = require('bluebird');
var models = require('../models/user');


// load the auth variables
var keys = require('./keys'); // use this one for testing
module.exports = function(app, passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({    
        usernameField : 'email',
        passwordField : 'pwd',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            if (!req.user) {
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    else {

                        var data=req.body;
                        console.log(req.body);
                        var newUser = models.User(data);
                        // var newProfile = models.Profile(data);

                        newUser.save(function(err,user) {
                            if (err)
                                return done(err);
                            // newProfile._id = user._id;
                            // newProfile.userid = user._id;
                            // newProfile.save(function(err) {
                            //     if (err)
                            //         return done(err);
                                return done(null, newUser);
                            // });
                        });
                        
                    }

                });
            }

        });

    }));

    passport.use('local-login', new LocalStrategy({    
        usernameField : 'email',
        passwordField : 'pwd',
        passReqToCallback : true
    },
    function(req, email, pwd, done) {
        process.nextTick(function() {
            if (!req.user) {
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user)
                    {
                        models.User.findOne({'pwd':pwd},function(errr,userr){
                            if(errr)
                            return done(err);
                            else
                            return done(null,userr);
                        })
                    }
                    else
                    {
                        return done(null, false, req.flash('signinMessage', 'Login Error !!'));    
                    }

                });
            }

        });

    }));


};
