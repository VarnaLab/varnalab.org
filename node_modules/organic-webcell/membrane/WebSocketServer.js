var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var io = require('socket.io');
var _ = require("underscore");

module.exports = function WebSocketServer(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.config = config;
  this.count = 0;
  this.responseClients = [];

  if(config.attachToChemical) {
    this.on(config.attachToChemical, function(chemical){
      this.server = io.listen(chemical.data.server, config.socketio || {});
      this.loadAddons(); 
      this.emit(new Chemical("WebSocketServer", self));
      this.server.set("log level", config.logLevel || 0);
      this.server.sockets.on('connection', function(socket){ self.handleIncomingConnection(socket); });
      return false;
    });
  }
  else
  if(config.port) {
    this.server = io.listen(config.port, config.socketio || {}, function(){
      self.loadAddons(); 
      self.emit(new Chemical("WebSocketServer", self));
    });
    this.server.set("log level", config.logLevel || 0);
    this.server.sockets.on('connection', function(socket){ self.handleIncomingConnection(socket); });
  }
  else
    throw new Error("Can't find attachToChemical or port in config", config);
     
  this.on("kill", function(){
    if(this.server && !this.config.attachToChemical)
      this.server.server.close();
    return false;
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.loadAddons = function(){
  if(this.config.addons) {
    var source;
    var addonConfig;
    for(var i = 0; i<this.config.addons.length; i++) {
      if(typeof this.config.addons[i] == "string") {
        source = this.config.addons[i];
        addonConfig = {};
      } else {
        source = this.config.addons[i].source;
        addonConfig = this.config.addons[i];
      }
      if(source.indexOf("/") !== 0)
        source = process.cwd()+"/"+source;
      require(source)(this, addonConfig);
    }
  }
}

module.exports.prototype.handleIncomingConnection = function (connection) {
  
  var self = this;
  _.each(this.config.events, function(chemicalAddon, eventName) {
    connection.on(eventName, function(data, callback){ //XXX callback
      self.handleIncomingMessage(eventName, chemicalAddon, data, connection, callback); 
    });
  });

  connection.on('disconnect', function(){
    self.emit(new Chemical("socketClosed", connection)); 
  });

  this.emit(new Chemical("socketConnection", connection));
}

module.exports.prototype.handleIncomingMessage = function(eventName, chemicalAddons, data, connection, callback){

  var chemical = new Chemical();
  if(typeof data == "object")
    _.extend(chemical, data);
  else
    chemical.data = data;
  _.extend(chemical, JSON.parse(JSON.stringify(chemicalAddons))); // better way to do it?

  chemical.connection = connection;
  
  this.emit(chemical, function(chemical){
    if(callback)
      callback(chemical.err, chemical.data);
  });
}