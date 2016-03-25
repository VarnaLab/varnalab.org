Base = require "./Base"
mongoose = require "mongoose"
validate = require "mongoose-validate"
crypto = require 'crypto'
_ = require 'underscore'

schema = mongoose.Schema
  email: {
    type: String,
    required: true,
    validate: [validate.email, 'invalid email address'],
    index:{ unique: true }
  }
  name: {type: String }
  password: { type: String, required: true }
  fbauth: {
    access_token: { type: String },
    generated: {type: Date},
    expires_in: {type: Number}
  }

schema.pre "save", (next) ->
  if not @isModified('password') or @password is null
    return next()
  md5sum = crypto.createHash('md5')
  md5sum.update @password
  @password = md5sum.digest('hex')
  next()

schema.method 'validPassword', (value) ->
  md5sum = crypto.createHash('md5')
  md5sum.update value
  md5sum.digest('hex') == @password

schema.method 'toPublicJSON', (extra) ->
  json = @toJSON()
  delete json.password
  if json.fbauth
    delete json.fbauth.access_token
  _.extend(json, extra || {})

Base.timestampify schema

module.exports = Base.model "Member", schema
