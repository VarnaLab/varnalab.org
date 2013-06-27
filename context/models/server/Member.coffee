Base = require "./Base"
mongoose = require "mongoose"
validate = require "mongoose-validate"

schema = mongoose.Schema
  email: { type: String, required: true, validate: [validate.email, 'invalid email address'], index:{ unique: true } }
  password: { type: String, required: true },

module.exports = Base.model "Member", schema
