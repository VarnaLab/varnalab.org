mongoose = require "mongoose"

createdModifiedPlugin = require("mongoose-createdmodified").createdModifiedPlugin

module.exports.db = mongoose # mongoose db connection

module.exports.model = (name, schema) ->
  mongoose.model name, schema
  module.exports.db.model name

module.exports.timestampify = (schema) ->
  schema.plugin createdModifiedPlugin, {index: true}

module.exports.attachGetUrlMethod = (schema) ->
  schema.method "getUrl", () ->
    [@created.getYear(), @created.getMonth(), @created.getDate(), @slug].join("/")

orderSame = (data, order) ->
  result = []
  for i in order
    for k in data
      if k._id.toString() == i.toString()
        result.push k
        break
  return result

module.exports.addPopulate = (schema) ->
  schema.method "populateArray", (referenceField, pattern, callback) ->
    if typeof pattern == "function"
      callback = pattern 
      pattern = {}
    return callback(null, @) if @[referenceField].length == 0

    refName = @schema.tree[referenceField].ref
    refName = @schema.tree[referenceField][0].ref if Array.isArray(@schema.tree[referenceField])
    pattern._id = {$in: @[referenceField]}
    module.exports.db.model(refName).find pattern, (err, results) =>
      return callback(err, @) if err
      @set(referenceField, orderSame(results, @[referenceField]), mongoose.Schema.Types.Mixed)
      callback(err, @)