var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var mongojs = require('mongojs');

module.exports = function MongoStore(plasma, config){
  Organel.call(this, plasma);

  this.store = mongojs.connect({db: config.dbname, safe: false});
  this.config = config;

  if(this.config.addons) {
    var source;
    var addonConfig;
    for(var i = 0; i<this.config.addons.length; i++) {
      if(typeof this.config.addons[i] == "string") {
        source = this.config.addons[i];
        addonConfig = config;
      } else {
        source = this.config.addons[i].source;
        addonConfig = this.config.addons[i];
      }
      if(source.indexOf("/") !== 0)
        source = process.cwd()+"/"+source;
      require(source)(this, addonConfig);
    }
  }

  var self = this;
  this.on("MongoStore", this.handleIncomingChemical);
  this.emit("MongoStore", this);

  this.on("kill", function(){
    this.store.close();
    return false;
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.handleIncomingChemical = function(chemical, sender, callback){

  if(!chemical.collection) {
    chemical.err = new Error("Missing collection in data", chemical);
    callback(chemical);
    return;
  }

  var collection = this.store.collection(chemical.collection);

  switch(chemical.method) {
    case "save":
      collection.save(chemical.data, chemical.options || {}, function(err, data){
        chemical.err = err;
        chemical.result = data;
        callback(chemical);
      });
    break;
    case "find":
      var pattern;
      var methodName;

      if(typeof chemical.data == "string") {
        methodName = "findOne";
        pattern = {_id:  mongojs.ObjectId(chemical.data)};
      } else {
        methodName = "find";
        pattern = chemical.data
      }
      collection[methodName](pattern, function(err, data){
        chemical.err = err;
        chemical.result = data;
        callback(chemical);
      });
    break;
    case "update":
      var pattern;
      if(typeof chemical.data == "string")
        pattern = {_id:  mongojs.ObjectId(chemical.data)};
      else
        pattern = chemical.data;
      collection.update(pattern, chemical.body, chemical.options || {}, function(err, count){
        chemical.err = err;
        chemical.result = count;
        callback(chemical);
      });
    break;
    case "remove":
      var pattern;
      if(typeof chemical.data == "string")
        pattern = {_id:  mongojs.ObjectId(chemical.data)};
      else
        pattern = chemical.data;
      collection.remove(pattern, chemical.options || {}, function(err, count){
        chemical.err = err;
        chemical.result = count;
        callback(chemical);
      });
    break;
    default: 
      throw new Error("couldn't understand type "+chemical.method);
    break;
  }
}