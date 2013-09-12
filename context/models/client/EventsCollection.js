module.exports = require("./MongoCollection").extend({
  url: "/api/events",
  model: require("./Event")
})