var BlogPost = require("models/server/BlogPost");

module.exports = function(pageNumberParamName, limit){
  return function(req, res, next) {
    var pageNumber = req.params[pageNumberParamName]?parseInt(req.params[pageNumberParamName]):0
    var skip = pageNumber*limit
    BlogPost.find({}).populate("creator")
      .limit(limit)
      .skip(skip)
      .sort({created: -1})
      .exec(function(err, blogs){
        if(err) return next(err);
        res.locals.blogs = blogs;
        res.locals.pageNumber = pageNumber
        res.locals.blogsLimit = limit
        next();
      })
  }
}
