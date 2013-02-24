var data = require("../_data");

module.exports = function(req, res, next) {
  data.loadAllBlogs(function(err, blogs){
    if(err) return next(err);
    req.blogs = blogs;
    next();
  })
}