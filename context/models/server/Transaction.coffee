Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  from: { type: mongoose.Schema.Types.Mixed, required: true }
  to: { type: String, required: true }
  reason: { type: String, required: true }
  amount: { type: Number, required: true }
  forDate: { type: Date,default: Date.now, required: true }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Transaction", schema
