var fs = require("fs");
var path = require("path");
var glob = require("glob");
var _ = require("underscore");
var md_parser = require("node-markdown").Markdown;
var $ = require("jquery");
var async = require("async");

var Blog = function(){
};

Blog.prototype.populate = function(filepath, callback) {
  var self = this;
  fs.readFile(filepath, function(err, md_text){
    if(err) return callback(err);
    var html = md_parser(md_text.toString());
    
    var $html = $("<html>"+html+"</html>");
    
    var titleParts = $html.find("h1").html().split("|");
    self.title = titleParts.shift();
    self.date = titleParts.shift();
    self.author = titleParts.shift();
    $html.find("h1").html(self.title);

    self.ingress = $html.find("p:first").html();
    $html.find("p:first").remove();
    
    self.content = $html.html();
    
    callback();
  })
}

module.exports.last3Blogs = function(callback){
  glob(__dirname+"/**/*.md", function(err, files) {
    if(err) return console.log(err);
    files = _.last(files, 3);
    async.map(files, function(file, next){
      var blogRecord = new Blog();
      blogRecord.populate(file, function(err){
        next(err, blogRecord);  
      });
    }, function(err, results){
      callback(results);
    })
  });
}