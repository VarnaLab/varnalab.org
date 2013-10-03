var path = require("path")

module.exports = function() {
  var Upload = require("models/server/Upload")
  return {
    "POST": function(req, res, next) {
      if(!req.files) return res.error("no files")
      if(!req.session.passport.user) return res.error("not logged")
      var uploads = []
      var uploader = require("async").queue(function(data, next){
        data.creator = req.session.passport.user
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
    }
  }
}