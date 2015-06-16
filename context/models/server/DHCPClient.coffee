Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  alias: {type: String, required: true }
  mac: { type: String, required: true }

Base.timestampify schema

module.exports = Base.model "DHCPClient", schema
