Base = require("./Base")
mongoose = require("mongoose")
validate = require("mongoose-validate")

schema = mongoose.Schema({
  title: { type: String, required: true }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member", required: true }
  content: { type: String, required: true }
  date: { type: Date, default: Date.now, required: true }
  slug: { type: String }
  tags: [{ 
    name: String
    slug: String
  }]
})

Base.timestampify schema
Base.attachGetUrlMethod schema

module.exports = Base.model("BlogPost", schema)