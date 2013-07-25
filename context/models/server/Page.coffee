Base = require('./Base');
mongoose = require('mongoose');
validate = require('mongoose-validate');

schema = mongoose.Schema({
  title: {type: String, required: true}
  creator: { type: mongoose.Schema.ObjectId, ref: "Member", required: true }
  content: {type: String, required:true}
  slug: {type: String, required: true}
});

Base.timestampify schema
Base.attachGetUrlMethod schema

module.exports = Base.model("BlogPost", schema);