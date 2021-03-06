//app server js file

//declare app
var express = require("express");

//required libraries
var fs = require('fs');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stylus = require('stylus');
var nib = require('nib');

var User = require('./models/user.js');
var YogaClass = require('./models/yogaClass.js');
var Massage = require('./models/massage.js');
var InAppMessage = require('./models/inAppMessage.js');
var FacebookPost = require('./models/facebookPost.js');

//connect to the database
mongoose.connect(process.env.MONGOHQ_URL);
//declare app variable
var app = express();

//add cross origin headers
var crossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

//middleware stack
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: process.env.SUPER_SECRET_SESSIONS_KEY}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname+'/public'));
  app.use(crossDomain);
  app.use(app.router);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(stylus.middleware({
    src: __dirname + '/public/styl',
    compile: function (str, path) {
      return stylus(str)
       .set('filename', path)
       .use(nib())
      }
  }));
});

//facebook logins
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  User.find({ 'facebook_id': user.id }).limit(1).exec(function (err, dbUsers) {

    // on no record found create user
    if (dbUsers.length < 1 || err) {
      user = User.create(user);
      done(null, user.id);
      console.log(err);
    } else {
      done(null, dbUsers[0]);
    };
  });
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//facebook login module
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/' 
  })
);

//sessions relay
app.get('/api/session', function(req, response){
  User.currentUser(req.session, function (currentUser) {
    response.send({
      session: req.session,
      currentUser: currentUser
    });
  });
});

app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//API

//Users API
app.get('/api/users', User.getUsers);
app.get('/api/users/current', User.getCurrentUser);
app.get('/api/users/:facebook_id', User.getUserById);

//app.delete('api/users/:id', User.deleteAll);

//Classes API
app.get('/api/yoga_classes/instructor/:instructor', YogaClass.getClassesByInstructor);
app.get('/api/yoga_classes/location/:location', YogaClass.getClassesByLocation);
app.get('/api/yoga_classes/date/:date', YogaClass.getClassesByDay);
app.get('/api/yoga_classes/participants/:id', YogaClass.getParticipants);
app.get('/api/yoga_classes', YogaClass.getClasses);
app.post('/api/yoga_classes', YogaClass.create);
app.put('/api/yoga_classes/:id', YogaClass.updateClass);
app.delete('/api/yoga_classes/all', YogaClass.deleteAll);
app.delete('/api/yoga_classes/:id', YogaClass.deleteClass);

//Massage API
app.get('/api/massage/date/:date', Massage.getByDate);
app.get('/api/massage/patient/:patient', Massage.getByPatient);
app.put('/api/massage', Massage.create);
//app.delete('/api/massage/:id', Massage.deleteMassage);

//InAppMessage API
app.get('/api/message/recipient/:id', InAppMessage.getByRecipient);
app.get('/api/message/sender/:id', InAppMessage.getBySender);
app.put('/api/message/create', InAppMessage.create);

//FacebookPost API
app.get('/api/fb_post/user/:id', FacebookPost.getByUserId);
app.put('/api/fb_post/', FacebookPost.create);

app.get('/', function(req, res){
  res.render('index');
});

app.get('/admin', function(req, res){
  res.render('admin');
});

app.get('/admin*', function(req, res){
  res.render('admin');
});

app.get('/*', function(req, res){
  res.render('index');
});
/**/

app.use(express.logger());
//app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
//expose app
exports = module.exports = app;
