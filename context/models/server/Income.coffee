mongoose = require "mongoose"
Base = require "./Base"

schema = mongoose.Schema
  source : 
    member: { type: mongoose.Schema.ObjectId, ref: "Member" }
    fullname: String
  amount: Number
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Income", schema