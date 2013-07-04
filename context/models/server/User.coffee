Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  name: { type:String, index:{unique:true} }
  income: [{ cache:{type:Number}, date:{type:Date} }]
, { collection: 'user' }

module.exports = Base.model "User", schema
