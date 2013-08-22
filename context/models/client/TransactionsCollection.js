module.exports = require("./MongoCollection").extend({
  url: "/api/transactions",
  model: require("./Transaction")
})