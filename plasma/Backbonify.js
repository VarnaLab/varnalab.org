var Organel = require("organic").Organel;

module.exports = Organel.extend(function Backbonify(plasma, config){
  Organel.call(this, plasma);

  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  
  this.config = config;

  this.on(config.attachOn || "Backbonify", function(){
    console.warn("Backbone object is global");

    Backbone = require("backbone");
    if(config.configPath)
      Backbone.config = require(config.configPath);
  
    return false; // do not aggregate, so that others can wire up too
  });
})
