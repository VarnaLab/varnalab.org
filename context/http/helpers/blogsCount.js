var BlogPost = require("models/server/BlogPost");

module.exports = function(req, res, next){
  BlogPost.count({}, function(err, count){
    res.locals.blogsCount = count;
    next();
  })
}