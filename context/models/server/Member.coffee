Base = require "./Base"
mongoose = require "mongoose"
validate = require "mongoose-validate"

schema = mongoose.Schema
  username: String
  fullname: { type: String, index:{ unique: true } }
  email: { type: String, required: true, validate: [validate.email, 'invalid email address'] }
  password: { type: String, required: true }

module.exports = Base.model "Member", schema
