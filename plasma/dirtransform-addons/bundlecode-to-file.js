var path = require("path");
var fs = require("fs");
var shelljs = require("shelljs");

module.exports = function(file, dest, options, next) {
  var self = this;
  var url = this.urlizeFile(file, options, path.sep+"app.js", ".app.js");
  
  self.plasma.emit({
    type: "BundleCode",
    code: file
  }, function(c){
    if(c instanceof Error) return next(c);
    shelljs.mkdir('-p', path.join(options.assetsStore, path.dirname(url)));
    var storedFilepath = path.join(options.assetsStore, url);
    fs.writeFile(storedFilepath, c.data, function(err){
      if(err) return next(err);
      dest[url] = storedFilepath;
      next();
    });
  });
}