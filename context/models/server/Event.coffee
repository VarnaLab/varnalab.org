Base = require "./Base"
mongoose = require "mongoose"
moment = require "moment"

schema = mongoose.Schema
  title: { type: String, required: true }
  description: { type: String, required: true }
  startDateTime: { type: Date, required: true }
  endDateTime: { type: Date }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }


schema.method 'startDate', () ->
  moment(@startDateTime).format("MMMM Do YYYY")

schema.method 'startDateNameOfDay', () ->
  moment(@startDateTime).format("dddd")

schema.method 'startTime', () ->
  moment(@startDateTime).format("h:mm:ss a")

schema.method 'isUpcoming', () ->
  moment(@startDateTime).isAfter(moment())

schema.method "getCreatorName", () ->
  if @get("creator")
    @get("creator").name || @get("creator").email
  else
    "unknown"

Base.timestampify schema

module.exports = Base.model "Event", schema
