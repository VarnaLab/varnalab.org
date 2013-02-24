var data = require("../_data");

module.exports = function(req, res, next){
  data.loadAllBlogs(function(err, blogs){
    req.blogsCount = blogs.length;
    next();
  })
}