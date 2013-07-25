var BlogPost = require("models/server/BlogPost");

module.exports.byFullUrl = function(req, res, next) {
  var pattern = {
    date: {
      $gte: new Date(req.params.year, req.params.month, req.params.date),
      $lt: new Date(req.params.year, req.params.month, req.params.date+1),
    },
    slug: req.params.slug
  }
  BlogPost.find(pattern, function(err, blog){
    if(err) return next(err);
    req.blog = blog;
    next();
  })
}

module.exports.last = function(count){
  count = count || 1;
  return function(req, res, next) {
    BlogPost.find({}).sort({date: -1}).limit(count).exec(function(err, blogs){
      if(err) return next(err);
      req.blogs = blogs;
      next();
    })
  }
}
