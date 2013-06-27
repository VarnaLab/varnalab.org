Base = require('./Base');
mongoose = require('mongoose');
validate = require('mongoose-validate');

schema = mongoose.Schema({
  title: {type: String, required: true},
  member: { type: mongoose.Schema.ObjectId, ref: "Member", required: true },
  content: {type: String, required:true},
  date: {type: Date, default: Date.now, required:true}
});

module.exports = Base.model("BlogPost", schema);