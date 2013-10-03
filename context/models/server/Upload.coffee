Base = require "./Base"
mongoose = require "mongoose"
moment = require "moment"

schema = mongoose.Schema
  name: String
  filename: String
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Upload", schema
