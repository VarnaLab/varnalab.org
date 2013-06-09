var path = require("path");
var fs = require("fs");

module.exports = function(file, app, options, next) {
  var self = this;
  var url = this.urlizeFile(file, options, path.sep+"app.js", ".app.js");

  if(this.config.log)
    console.log("pagecode GET", url);

  app.get(url, function(req, res, next){
    self.plasma.emit({
      type: "BundleCode",
      code: file
    }, function(c){
      if(c instanceof Error) return next(c);
      if(options.assetsStore)
        fs.writeFile(path.join(options.assetsStore, getFilename(url)), c.data, function(err){
          if(err) next(err);
        });
      res.setHeader("content-type","text/javascript");
      res.send(c.data);
    });
  });
  next();
}