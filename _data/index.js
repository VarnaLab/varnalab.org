var glob = require("glob");
var _ = require("underscore");

var async = require("async");

var Blog = require("./Blog");
var Event = require("./Event");

var Data = module.exports = {};

Data.loadMarkdownRecords = function(dir, Model, callback) {
  glob(dir, function(err, files) {
    if(err) return callback(err);

    async.map(files, function(file, next){
      var record = new Model();
      record.populate(file, function(err){
        next(err, record);  
      });
    }, function(err, results){
      if(err) return callback(err);
      callback(null, results);
    })
  });
}

Data.loadAllBlogs = function(callback) {
  if(module.exports.blogs)
    return callback(null, Data.blogs);

  Data.loadMarkdownRecords(__dirname+"/blogs/**/*.md", Blog, function(err, records){
    if(err) return callback(err);
    Data.blogs = records.reverse();
    callback(null, Data.blogs);
  })
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

Data.loadAllEvents = function(callback) {
  if(module.exports.events)
    return callback(null, Data.events);

  Data.loadMarkdownRecords(__dirname+"/events/**/*.md", Event, function(err, records){
    if(err) return callback(err);
    Data.events = records;
    callback(null, Data.events);
  })
}

Data.upcomingEvents = function(callback){
  Data.loadAllEvents(function(err, events){
    if(err) return callback(err);
    var upcoming = _.filter(events, function(e){ return e.upcoming; });
    callback(null, _.first(upcoming, 3));
  });
}

Data.getEventByName = function(name, callback) {
  Data.loadAllEvents(function(err, events){
    if(err) return callback(err);
    callback(null, _.find(events, function(event){
      return event.title == name;
    }));
  });
}