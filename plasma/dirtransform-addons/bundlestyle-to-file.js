var path = require("path");
var fs = require("fs");
var path = require("path");
var shelljs = require("shelljs");

module.exports = function(file, dest, options, next) {
  var self = this;
  var url = this.urlizeFile(file, options, path.sep+"bundle.css", ".bundle.css");
  self.plasma.emit({
    type: "BundleStyle",
    style: file
  }, function(c){
    if(c instanceof Error) {console.error(c); return next(c);}
    shelljs.mkdir('-p', path.join(options.assetsStore, path.dirname(url)));
    var storedFilepath = path.join(options.assetsStore, url);
    fs.writeFile(storedFilepath, c.data, function(err){
      if(err) return next(err);
      dest[url] = storedFilepath;
      next();  
    });
  });
  
}