var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create user model


var userSchema = new Schema({
    facebook_id: String,
    first_name: String,
    last_name: String,
    fb_username: String,
    time_created: Date,
});

var User = mongoose.model('User', userSchema);


User.create = function(data){
  var keep_data={
    facebook_id: data.id,
    first_name: data.name.givenName,
    last_name: data.name.familyName,
    fb_username: data.username,
    time_created: new Date(),
  };
  var newUser = new User(keep_data);
  newUser.save();
};

User.currentUser = function(session, callback){
  if (session && 
      session.passport && 
      session.passport.user && 
      session.passport.user.facebook_id){
    User.find({facebook_id: session.passport.user.facebook_id}).limit(1).exec(function(err, users) {
      callback(users[0]);
    });
  } else{
    callback({});
  }
};

User.getUsers = function(req, res){
  var users = User.find({}).exec(function(err, users){
    res.send({users: users});
});
};

User.getUserById = function(req, res){
  var user = User.find({facebook_id: req.params.facebook_id}).exec(function(err,userFound){
     res.send({user: userFound});
  });
};

/*
User.deleteAll = function(req, res){
  User.remove(function(err){
    if (!err){
      console.log('removed');
      return res.send(User.find({}));
    }
    else{
      console.log(err);

    }
  });
};
*/

module.exports = User;