var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;
var _ = require("underscore");

module.exports = function CallAction(plasma, config){
  Organel.call(this, plasma);

  this.config = config;

  this.on(config.handleChemicalType || "CallAction", function(chemical, sender, callback){
    var dataLogic = _.clone(chemical.action);
    
    var self = this;
    if(Array.isArray(dataLogic)) {
      var next = function(){
        var handler = dataLogic.shift();
        if(handler) {
          handler = require(process.cwd()+handler);
          handler.call(self, chemical, next);
        } else {
          callback(chemical);
        }
      }
      next();
    } else {
      dataLogic = require(process.cwd()+dataLogic);
      dataLogic.call(this, chemical, callback);
    }
  });
}

util.inherits(module.exports, Organel);