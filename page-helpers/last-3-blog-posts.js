var data = require("../_data");

module.exports = function(req, res, next) {
  data.last3Blogs(function(blogs) {
    req.blogs = blogs;
    next();
  });
}