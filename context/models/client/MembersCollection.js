module.exports = require("./MongoCollection").extend({
  url: "api/members",
  model: require("./Member")
})