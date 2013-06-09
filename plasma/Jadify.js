var Organel = require("organic").Organel;
var jade = require("jade");
var fs = require('fs');
var _ = require("underscore");

module.exports = Organel.extend(function Jadify(plasma, config){
  Organel.call(this, plasma);

  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  
  this.config = config;

  this.on(this.config.reactOn, function(c){
    require.extensions['.jade'] = function(module) {
      var contents = fs.readFileSync(module.filename);
      var template = jade.compile(contents,{
        filename: module.filename
      });
      module.exports = function(data){
        var templateData = _.extend({}, data, c.data.app._locals);
        return template(templateData);
      }
    }
    return false;
  })
})
