var _ = require("underscore")
module.exports = function (config) {
  var BlogPost = require(config.models + '/BlogPost');
  return {
    'GET' : function (req, res) {
      BlogPost.find({}).populate("creator").sort({created: -1}).exec(function(err, blogposts) {
        if (err) return res.error(err);
        res.result(blogposts);
      });
    },
    'POST /add' : function (req, res) {
      if(req.session.passport.user)
        req.body.creator = req.session.passport.user;

      BlogPost.createUniqueByDateAndSlug(req.body, function (err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    },
    'GET /:id' : function (req, res) {
      BlogPost.findById(req.params.id, function(err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    },
    "PUT /:id": function(req, res) {
      BlogPost.findById(req.params.id,function(err, blogpost){
        if(err || !blogpost) return res.error(err || "not found");
        _.extend(blogpost, req.body)
        blogpost.save(function(err){
          if(err) return res.error(err);
          res.result(blogpost)
        })
      })
    },
    "DELETE /:id": function(req, res) {
      BlogPost.findByIdAndRemove(req.params.id, function(err, blogpost){
        if(err) return res.error(err);
        res.result(blogpost);
      })
    }
  }
}
