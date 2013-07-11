Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  title: { type: String, required: true }
  description: { type: String, required: true }
  startDateTime: { type: Date, required: true }
  endDateTime: { type: Date }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

Base.timestampify schema

module.exports = Base.model "Event", schema
