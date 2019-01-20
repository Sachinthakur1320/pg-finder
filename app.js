const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session=require('express-session');
const mongoose=require('mongoose');
const MongoStore= require('connect-mongo')(session);
const flash=require('connect-flash');
const app = express();
app.use(cookieParser());
require('./config/passport');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({secret:"uias4s5dftpa5ss4",
resave:false,
saveUninitialized:false,
store: new MongoStore({mongooseConnection: mongoose.connection}),
cookie: { maxAge: 180*60*1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session;
    next();
    });
app.use('/user', userRoutes);  
app.use('/', routes);
module.exports = app;