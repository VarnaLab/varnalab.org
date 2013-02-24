var util = require("util");
var express = require('express');
var _ = require("underscore");
var fs = require("fs");

var Chemical = require("organic").Chemical;
var Organel = require("organic").Organel;

module.exports = function ExpressHttpServer(plasma, config){
  Organel.call(this, plasma);

  var app = this.app = express.createServer();
  this.responseClients = [];
  this.count = 0;
  this.config = config;
  var self = this;

  this.mountMiddleware();
  this.app.use(this.app.router);
  this.mountHttpRoutes();
  
  this.on("kill", this.close);

  config.port = config.port || 1337;

  this.server = app.listen(config.port, function(){
    console.log('HttpServer running at http://127.0.0.1:'+config.port+'/');  
    self.emit(new Chemical("HttpServer", self));
  });
  
}

util.inherits(module.exports, Organel);

module.exports.prototype.mountMiddleware = function(){
  if(!this.config.middleware) return;
  
  var self = this;
  _.each(this.config.middleware, function(middleware){
    
    var middlewareSource = middleware.source || middleware;
    var middlewareConfig = middleware.source?middleware:{};
    if(middlewareSource.indexOf("/") !== 0)
      middlewareSource = process.cwd()+"/"+middlewareSource;
    
    if(self.config.logMiddleware)
      console.log("middleware: ",middlewareSource, JSON.stringify(middlewareConfig).yellow);
    var middlewareFunc = require(middlewareSource)(middlewareConfig, self);
    if(middlewareFunc)
      self.app.use(middlewareFunc);
  });
}

module.exports.prototype.mountHttpRoutes = function(){
  if(!this.config.routes) return;

  var self = this;
  _.each(this.config.routes, function(chemicalAddons, path){
    if(self.config.logRoutes)
      console.log("route: ",path.green, JSON.stringify(chemicalAddons).yellow);
    self.app.all(path, function(req, res){ self.handleIncomingRequest(chemicalAddons, req, res); });  
  });

  if(this.config.notfoundRoute) {
    this.app.all("*", function(req, res){
      self.handleIncomingRequest(self.config.notfoundRoute, req, res);
    });
  }
}

module.exports.prototype.handleIncomingRequest = function(chemicalAddons, req, res){
  var chemical = new Chemical();
  
  chemical.req = req;
  chemical.res = res;
  _.extend(chemical, JSON.parse(JSON.stringify(chemicalAddons))); // better way to do it?

  // finally emit to the plasma
  this.emit(chemical, function(response){
    if(response['content-type'])
      res.header('Content-type', response['content-type']);
    if(response.data instanceof Buffer) {
      res.write(response.data);
      res.end();
    } else {
      res.send(response.data, response.statusCode || 200);
    }
  });
}

module.exports.prototype.close = function(chemical){
  this.server.close();
  this.closed = true;
  return false;
}