mongoose = require "mongoose"
Base = require "./Base"

schema = mongoose.Schema
  targetId: { type: mongoose.Schema.ObjectId, ref: "OutcomeTarget" }
  amount: Number
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Outcome", schema