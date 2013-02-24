var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;
var _ = require("underscore");

module.exports = function CallChain(plasma, config){
  Organel.call(this, plasma);

  this.config = config;

  this.on(config.handleChemicalType || "CallChain", function(chemical, sender, callback){
    var chain = chemical.chain;
    var index = 0;
    var self = this;
    var lastChemical;

    var emitNext = function(){
      if(chain[index]) {
        var data = _.extend({}, chemical, chain[index++]);
        var c = new Chemical(data);
        self.emit(c, function(response){
          _.extend(chemical, response);
          emitNext();
        });
      } else {
        callback(chemical);
      }
    }
    
    emitNext();
  });
}

util.inherits(module.exports, Organel);