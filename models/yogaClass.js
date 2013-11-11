var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create class model

var yogaClassSchema = new Schema({
    instructor: String,
    location: String,
    date: Date,
    time: String,
    duration: String,
    sytle: String,
    suggestedDonation: String,
    participants: String
});

var YogaClass = mongoose.model('YogaClass', yogaClassSchema);

YogaClass.create = function(data){
  var newYogaClass = new YogaClass(data);
  newYogaClass.save();
};

YogaClass.getClassesByInstructor = function(req, res){
	YogaClass.find({instructor: req.params.instructor}).exec(function (err, classesReturned){
	res.send({"classes": classesReturned});
});
};

YogaClass.getClassesByLocation = function(req, res){
	YogaClass.find({location: req.params.location}).exec(function (err, classesReturned){
	res.send({"classes": classesReturned});
});
};

YogaClass.getClassesByDate = function(req, res){
	YogaClass.find({date: req.params.date}).exec(function (err, classesReturned){
	res.send({"classes": classesReturned});
});
};

YogaClass.getParticipants = function(req, res){
	YogaClass.find({_id: req.params._id}).exec(function (err, classReturned){
		res.send({"participants": classReturned.participants})
	});
};

YogaClass.updateClass = function(req,res){
	YogaClass.update({_id: req.params._id}, req.params.options);
};

/*YogaClass.deleteClass = function(req, res){
	YogaClass.delete({_id: req.params._id});
};*/

module.exports = YogaClass;