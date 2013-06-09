mongoose = require "mongoose"
Base = require "./Base"

schema = mongoose.Schema
  memberId: { type: mongoose.Schema.ObjectId, ref: "Member" }
  amount: Number
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Income", schema