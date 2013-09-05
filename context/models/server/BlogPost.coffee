Base = require("./Base")
mongoose = require("mongoose")
validate = require("mongoose-validate")
moment = require("moment")
marked = require("marked")

schema = mongoose.Schema({
  title: { type: String, required: true }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member", required: true }
  content: { type: String, required: true }
  date: { type: Date, default: Date.now }
  slug: { type: String }
  tags: [{ 
    name: String
    slug: String
  }]
})

schema.method 'createdDate', () ->
  moment(@created).format("MMMM Do YYYY")

schema.method 'createdNameOfDay', () ->
  moment(@created).format("dddd")

schema.method 'createdTime', () ->
  moment(@created).format("h:mm:ss a")

schema.method 'htmlContent', () ->
  marked @content

Base.timestampify schema
Base.attachGetUrlMethod schema

module.exports = Base.model("BlogPost", schema)