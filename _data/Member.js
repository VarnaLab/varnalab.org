var fs = require("fs");
var md_parser = require("node-markdown").Markdown;
var $ = require("jquery");
var moment = require("moment");

var Member = module.exports =  function(){
};

Member.prototype.populate = function(filepath, callback) {
  var self = this;
  fs.readFile(filepath, function(err, md_text){
    if(err) return callback(err);
    var html = md_parser(md_text.toString());
    
    var $html = $("<html>"+html+"</html>");
    
    self.name = $html.find("h1").html().trim();
    $html.find("h1").remove();

    self.content = $html.html();
    
    callback(null, self);
  })
}
