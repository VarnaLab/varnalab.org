Base = require "./Base"
mongoose = require "mongoose"

schema = mongoose.Schema
  name: { type:String, index:{unique:true} }
  spend: [{ cache:{type:Number}, date:{type:Date} }]
, { collection: 'spend' }

module.exports = Base.model "Spend", schema
