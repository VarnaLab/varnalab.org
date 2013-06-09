var Organel = require("organic").Organel;
var jade = require("jade");
var fs = require('fs');
var path = require("path");
var _ = require("underscore");

module.exports = Organel.extend(function Required(plasma, config){
  Organel.call(this, plasma);

  if(config.target)
    for(var key in config.target)
      config.target[key] = path.join(process.cwd(),config.target[key]);
  
  this.config = config;

  for(var key in config.target) {
    var dest = path.join(process.cwd(),"node_modules",key);
    if(!fs.existsSync(dest))
      fs.symlinkSync(config.target[key], dest);
  }
})
