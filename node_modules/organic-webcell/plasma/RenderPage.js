var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;
var jade = require("jade");
var fs = require("fs");
var _ = require("underscore");

module.exports = function RenderPage(plasma, config){
  Organel.call(this, plasma);
  var self = this;
  this.files = {};
  if(config.useCache)
    console.log("using page template caching");

  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];

  this.config = config;

  this.on("RenderPage", function(chemical, sender, callback){

    var target = (chemical.root || config.root || "")+(chemical.page || config.page);
    if(target.indexOf(".jade") === -1)
      target += ".jade";

    if(!self.files[target] || !config.useCache){
      fs.readFile(target, function(err, fileData){
        if(err){
          err.message += " while trying to render "+target;
          callback(err);
          return;
        }
        self.files[target] = jade.compile(fileData, _.extend({
          filename: target
        }, chemical.jadeConfig || config.jadeConfig || {}));
        chemical.data = self.files[target](chemical);
        callback(chemical);
      });
    } else {
      chemical.data = self.files[target](chemical)
      callback(chemical);
    }
  });
}

util.inherits(module.exports, Organel);