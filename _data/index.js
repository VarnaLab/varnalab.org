var glob = require("glob");
var _ = require("underscore");

var async = require("async");

var Blog = require("./Blog");

var Data = module.exports = {};

Data.loadAllBlogs = function(callback) {
  if(module.exports.blogs)
    return callback(null, Data.blogs);

  glob(__dirname+"/**/*.md", function(err, files) {
    if(err) return callback(err);

    async.map(files, function(file, next){
      var blogRecord = new Blog();
      blogRecord.populate(file, function(err){
        next(err, blogRecord);  
      });
    }, function(err, results){
      if(err) return callback(err);
      Data.blogs = results.reverse();
      callback(null, Data.blogs);
    })
  });
}

Data.last3Blogs = function(callback){
  Data.loadAllBlogs(function(err, blogs){
    if(err) return callback(err);
    callback(null, _.first(blogs, 3));
  });
}

Data.getBlogByName = function(name, callback) {
  Data.loadAllBlogs(function(err, blogs){
    if(err) return callback(err);
    callback(null, _.find(blogs, function(blog){
      return blog.title == name;
    }));
  });
}