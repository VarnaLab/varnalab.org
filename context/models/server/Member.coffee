Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  email: {type: String, index:{ unique: true } }
  password: String

module.exports = Base.model "Member", schema
