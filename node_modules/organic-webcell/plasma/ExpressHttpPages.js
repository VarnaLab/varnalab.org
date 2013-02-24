var util = require("util");
var Organel = require("organic").Organel;
var glob = require('glob');
var path = require("path");
var _ = require("underscore");
var fs = require("fs");
var first = require('first');

var Actions = require("../lib/Actions");
var Context = require("../lib/Context");
var DirectoryTree = require("../lib/DirectoryTree");

module.exports = function ExpressHttpPages(plasma, config){
  Organel.call(this, plasma);

  var context = {
    plasma: this.plasma
  };
  var self = this;

  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];

  this.config = config;
  this.started = new Date((new Date()).toUTCString());

  // bootstrap all actions once httpserver is ready
  this.on("HttpServer", function(chemical){
    var app = chemical.data.app;
    if(config.pageHelpers) {
      Context.scan({
        root: config.pageHelpers,
        extname: ".js"
      }, context, function(err){
        self.mountPageActions(app, config, context, function(){
          self.emit("ExpressHttpPages", self);
        });
      })
    } else 
      self.mountPageActions(app, config, context, function(){
        self.emit("ExpressHttpPages", self);
      });
    return false;
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.mountPageActions = function(app, config, context, callback){
  var actionsRoot = config.pages;
  var self = this;

  first(function(){
    self.actions = new DirectoryTree();
    self.actions.scan({
      targetsRoot: actionsRoot,
      targetExtname: ".js",
      mount: config.mount,
      indexName: "index.js",
      excludePattern: ".jade.js"
    }, function(file, url, next){
      Actions.map(require(file).call(context, config), url, function(method, url, handler){
        self.mountPageAction(app, method, url, handler, file.replace(".js", ".jade"));
      });
      next();
    }, this);
  })
  .whilst(function(){
    self.pagesWithoutActions = new DirectoryTree();
    self.pagesWithoutActions.scan({
      targetsRoot: actionsRoot,
      targetExtname: ".jade",
      mount: config.mount,
      indexName: "index.jade"
    }, function(file, url, next){
      fs.exists(file.replace(".jade", ".js"), function(exists){
        if(!exists) {
          self.mountPageAction(app, "GET", url, function(req, res){
            res.sendPage(); 
          }, file);
        }
        next();
      })
    }, this);
  })
  .whilst(function(){
    self.styles = new DirectoryTree();
    self.styles.scan({
      targetsRoot: actionsRoot,
      targetExtname: ".less",
      mount: config.mount,
      indexName: "index.jade.less"
    }, function(file, url, next){
      self.mountPageStyle(app, url, file);
      next();
    }, this);
  })
  .whilst(function(){
    self.codes = new DirectoryTree();
    self.codes.scan({
      targetsRoot: actionsRoot,
      targetExtname: ".jade.js",
      mount: config.mount,
      indexName: "index.jade.js"
    }, function(file, url, next){
      self.mountPageCode(app, url, file);
      next();
    }, this);
  })
  .then(function(){
    if(callback) callback();
  })
}

module.exports.prototype.mountPageStyle = function(app, url, file) {
  var self = this;
  if(url == "")
    url = "/style.css";
  else
    url += "/style.css";

  if(this.config.log)
    console.log("pagestyle GET", url);
  if(this.config.prebuildAssets)
    self.emit({
      type:"BundleStyle",
      style: file
    }, function(){
      if(self.config.log)
        console.log("pagestyle prebuild done", url);
    })

  app.get(url, function(req, res){
    self.emitAndSend({
      type: "BundleStyle",
      style: file, 
      data: _.extend({}, req),
    }, req, res, "text/css");
  })
}

module.exports.prototype.mountPageCode = function(app, url, file) {
  var self = this;
  if(url == "")
    url = "/code.js";
  else
    url += "/code.js";

  if(this.config.log)
    console.log("pagecode GET", url);
  if(this.config.prebuildAssets)
    self.emit({
      type:"BundleCode",
      code: file
    }, function(){
      if(self.config.log)
        console.log("pagecode prebuild done", url);
    })

  app.get(url, function(req, res){
    self.emitAndSend({
      type: "BundleCode",
      code: file, 
      data: _.extend({}, req)
    }, req, res, "text/javascript");
  });
}

module.exports.prototype.emitAndSend = function(chemical, req, res, contentType) {
  var self = this;
  if(!self.config.debug) {
    var modified = true;
    try {
      var mtime = new Date(req.headers['if-modified-since']);
      if (mtime.getTime() >= self.started.getTime()) {
        modified = false;
      }
    } catch (e) {
      console.warn(e);
    }
    if (!modified) {
      res.writeHead(304);
      res.end();
      return;
    }
  }

  self.emit(chemical, function(c){
    if(!self.config.debug) {
      res.setHeader('last-modified', self.started.toUTCString());
      res.setHeader("content-type", contentType);
      res.send(c.data);
    } else {
      res.setHeader("content-type", contentType);
      res.send(c.data);
    }
  });
}

module.exports.prototype.applyHelpers = function(template, req, res) {
  var self = this;
  _.extend(req, this.config);
  res.renderPage = function(data, path, callback) {
    if(typeof data == "string") {
      path = data;
      data = {};
    }
    if(typeof path == "function") {
      callback = path;
      path = undefined;
    }

    if(path && path.indexOf("/") != 0)
      path = process.cwd()+"/"+path;

    self.emit(_.extend({
      type: "RenderPage",
      page: path || template
    }, req, data), callback);
  }
  res.sendPage = function(data, path){
    res.renderPage(data, path, function(c){
      res.send(c.data);
    });
  }
}

module.exports.prototype.mountPageAction = function(app, method, url, action, template) {
  var self = this;

  if(url == "")
    url = "/";
  var args = [url];

  if(Array.isArray(action)) {
    _.each(action, function(a){
      args.push(function(req, res, next){
        self.applyHelpers(template, req, res);
        a(req, res, next);
      });
    });
  } else {
    args.push(function(req, res, next){
      self.applyHelpers(template, req, res);
      action(req, res, next);
    });
  }
  
  if(this.config.log)
    console.log("pageaction", method, url);
  
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