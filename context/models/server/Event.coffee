Base = require "./Base"
mongoose = require "mongoose"
moment = require 'moment-timezone'
marked = require("marked")


schema = mongoose.Schema
  title: { type: String, required: true }
  description: { type: String, required: true }
  startDateTime: { type: Date, required: true }
  endDateTime: { type: Date }
  creator: { type: mongoose.Schema.ObjectId, ref: "Member" }

schema.static 'getByDateAndTitle', (year, month, date, title, callback) ->
  pattern = {
    startDateTime: {
      $gte: new Date(year, month, date),
      $lt: new Date(year, month, date+1),
    },
    title: title
  }
  @findOne(pattern).populate("creator").exec callback

schema.method 'startDate', () ->
  moment(@startDateTime).locale('bg').format("MMMM Do YYYY")

schema.method 'startDateNameOfDay', () ->
  moment(@startDateTime).locale('bg').format("dddd")

schema.method 'startTime', () ->
  moment(@startDateTime).tz("Europe/Sofia").format("HH:mm:ss")

schema.method 'isUpcoming', () ->
  moment(@startDateTime).tz("Europe/Sofia").isAfter(moment())

schema.method 'htmlContent', () ->
  marked @description

schema.method "getUrl", () ->
  [@startDateTime.getFullYear(), @startDateTime.getMonth()+1, @startDateTime.getDate(), @title].join("/")

schema.method "getCreatorName", () ->
  if @get("creator") && @get("creator").name
    @get("creator").name
  else
    "unknown"

Base.timestampify schema

module.exports = Base.model "Event", schema
