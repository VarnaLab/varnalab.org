Base = require("./Base")
mongoose = require("mongoose")
validate = require("mongoose-validate")
moment = require("moment")
marked = require("marked")

schema = mongoose.Schema({
  title: { type: String, required: true }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member", required: true }
  ingress: { type: String, required: false }
  content: { type: String, required: true }
  date: { type: Date, default: Date.now }
  slug: { type: String }
  tags: [{ 
    name: String
    slug: String
  }]
})

schema.pre 'save', (next) ->
  if !/^[0-9a-fA-F]{24}$/i.test(@creator) 
    next(new Error("Invalid member id provided"))
  else
    next()

schema.method 'createdDate', () ->
  moment(@created).format("MMMM Do YYYY")

schema.method 'createdNameOfDay', () ->
  moment(@created).format("dddd")

schema.method 'createdTime', () ->
  moment(@created).format("h:mm:ss a")

schema.method 'htmlContent', () ->
  marked @content

schema.method 'htmlIngress', () ->
  marked(@ingress || @content).substr(0, 255)

Base.timestampify schema
Base.attachGetUrlMethod schema

module.exports = Base.model("BlogPost", schema)