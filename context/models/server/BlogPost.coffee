Base = require("./Base")
mongoose = require("mongoose")
validate = require("mongoose-validate")
moment = require("moment")
marked = require("marked")

schema = mongoose.Schema({
  title: { type: String, required: true }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member", required: true }
  originalAuthor: String
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

schema.static 'getBlogpostByDateAndSlug', (year, month, date, slug, callback) ->
  pattern = {
    created: {
      $gte: new Date(year, month, date),
      $lt: new Date(year, month, date+1),
    },
    slug: slug
  }
  @findOne(pattern).populate("creator").exec callback

schema.static 'createUniqueByDateAndSlug', (data, callback) ->
  creationDate = new Date()
  if data.date
    creationDate = new Date(data.date)

  @getBlogpostByDateAndSlug creationDate.getFullYear(), creationDate.getMonth(),
    creationDate.getDate(), data.slug, (err, found) =>
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
  marked(@ingress || @content).replace(/(<([^>]+)>)/ig,"").substr(0, 255)

schema.method "getUrl", () ->
  [@created.getFullYear(), @created.getMonth()+1, @created.getDate(), @slug].join("/")

schema.method "getCreatorName", () ->
  if @originalAuthor
    return @originalAuthor

  if @get("creator") && @get("creator").name 
    return @get("creator").name
  else
    return "unknown"

Base.timestampify schema

module.exports = Base.model("BlogPost", schema)
