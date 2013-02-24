var util = require("util");
var Organel = require("organic").Organel;
var glob = require('glob');
var path = require("path");
var _ = require("underscore");

var Actions = require("../lib/Actions");
var Context = require("../lib/Context");
var DirectoryTree = require("../lib/DirectoryTree");

module.exports = function ExpressHttpActions(plasma, config){
  Organel.call(this, plasma);

  var context = {
    plasma: this.plasma
  };
  var self = this;

  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  
  this.config = config;

  this.on("HttpServer", function(chemical){
    var app = chemical.data.app;
    if(config.actionHelpers) {
      Context.scan({
        root: config.actionHelpers,
        extname: ".js"
      }, context, function(err){
        self.mountActions(app, config, context, function(){
          self.emit("ExpressHttpActions", self);
        });
      })
    } else 
      self.mountActions(app, config, context, function(){
        self.emit("ExpressHttpActions", self);
      });
    return false;
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.mountActions = function(app, config, context, callback){
  var self = this;
  var actionsRoot = config.actions;
  self.actions = new DirectoryTree();
  self.actions.scan({
    targetsRoot: actionsRoot,
    targetExtname: ".js",
    mount: config.mount,
    indexName: "index.js"
  }, function(file, url, next){
    Actions.map(require(file).call(context, config), url, function(method, url, handler){
      self.mountAction(app, method, url, handler);
    });
    next();
  }, callback);
}

var request = function(req) {
};
var response = function(res) {
  res.result = function(data) {
    res.send({result: data});
  }
  res.success = function(result){
    res.send({result: result});
  }
  res.error = function(err){
    res.send({result: err}, 500);
  }
};

module.exports.prototype.mountAction = function(app, method, url, action) {
  if(url == "")
    url = "/";
  var args = [url];
  if(Array.isArray(action)) {
    _.each(action, function(a){
      args.push(function(req, res, next){
        request(req);
        response(res);
        a(req, res, next);
      });
    });
  } else {
    args.push(function(req, res, next){
      request(req);
      response(res);
      action(req, res, next);
    });
  }
  
  if(this.config.log)
    console.log("action", method, url);
  switch(method) {
    case "GET":
      app.get.apply(app, args);
    break;
    case "POST":
      app.post.apply(app, args);
    break;
    case "PUT":
      app.put.apply(app, args);
    break;
    case "DELETE":
      app.del.apply(app, args);
    break;
    case "*":
      app.all.apply(app, args);
    break;
  }
};