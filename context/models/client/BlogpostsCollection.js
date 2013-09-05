module.exports = require("./MongoCollection").extend({
  url: "/api/blogposts",
  model: require("./Blogpost")
})