var BlogPost = require("models/server/BlogPost");

module.exports.byFullUrl = function(req, res, next) {
  var year = parseInt(req.params.year)
  var month = parseInt(req.params.month)-1
  var date = parseInt(req.params.date)
  var slug = req.params.slug
  BlogPost.getBlogpostByDateAndSlug(year, month, date, slug, function(err, blog){
    if(err) return next(err);
    req.blog = blog;
    next();
  })
}

module.exports.last = function(count){
  count = count || 1;
  return function(req, res, next) {
    BlogPost.find({}).sort({created: -1}).limit(count).populate("creator").exec(function(err, blogs){
      if(err) return next(err);
      req.blogs = blogs;
      next();
    })
  }
}
