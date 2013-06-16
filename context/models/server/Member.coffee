Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  username: String
  fullname: { type: String, index:{ unique: true } }
  email: String
  password: String

module.exports = Base.model "Member", schema
