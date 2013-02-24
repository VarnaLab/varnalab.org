var data = require("../_data");

module.exports = function(name) {
  return function(req, res, next) {
    data.getBlogByName(req.params[name], function(err, blog){
      if(err) return next(err);
      req.blog = blog;
      next();
    })
  }
}