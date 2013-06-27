Base = require('./Base');
mongoose = require('mongoose');
validate = require('mongoose-validate');

schema = mongoose.Schema({
	title: {type: String, require: true},
	member: { type: mongoose.Schema.ObjectId, ref: "Member" },
	content: {type: String, require:true},
	date: {type: Date, default: Date.now, require:true}
});

module.exports = Base.model("BlogPost", schema);