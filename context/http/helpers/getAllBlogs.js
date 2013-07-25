var BlogPost = require("models/server/BlogPost");

module.exports = function(req, res, next) {
  BlogPost.find({}, function(err, blogs){
    if(err) return next(err);
    req.blogs = blogs;
    next();
  })
}