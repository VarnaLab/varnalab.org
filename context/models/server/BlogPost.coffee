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

schema.static 'createUniqueByDateAndSlug', (data, callback) ->
  creationDate = new Date()
  if data.date
    creationDate = new Date(data.date)
  pattern = {
    created: {
      $gte: new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate()),
      $lt: new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate()+1),
    },
    slug: data.slug
  }
  @findOne pattern, (err, found) =>
    return callback("blog post with same slug name exists already for given date") if found
    @create data, callback

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