var path = require("path")
var formidable = require('formidable')
var _ = require('underscore')

module.exports = function(plasma, dna, helpers) {
  var Upload = require("models/server/Upload")
  return {
    "POST": function(req, res, next) {
      if(!req.user) return res.error("not logged")

      // parse a file upload
      var form = new formidable.IncomingForm()

      _.extend(form, dna.formidable)

      form.parse(req, function(err, fields, files) {
        if(err) return res.error(err)
        if(!files) return res.error("no files")
        req.files = files
        var uploads = []
        var uploader = require("async").queue(function(data, next){
          data.creator = req.user
          data.filename = path.basename(data.path)
          Upload.create(data, function(err, stored_upload){
            if(err) return next(err)
            uploads.push(stored_upload)
            next()
          })
        }, 2)
        uploader.drain = function(){
          res.send({result: uploads, success: true})
        }
        for(var key in req.files)
          uploader.push(req.files[key])
      })
    }
  }
}