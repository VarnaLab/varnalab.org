mongoose = require "mongoose"
Base = require "./Base"

schema = mongoose.Schema
  name: String
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "OutcomeTarget", schema