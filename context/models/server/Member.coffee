Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  username: String
  email: String
  password: String

module.exports = Base.model "Member", schema 