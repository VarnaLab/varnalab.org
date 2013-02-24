var Organel = require("organic").Organel;
var _ = require("underscore");
var path = require('path');
var shelljs = require("shelljs");
var fs = require('fs');
var async = require('async');

module.exports = Organel.extend(function Self(plasma, config){
  Organel.call(this, plasma, config);
  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  this.config = config;
  var self = this;
  self.config.upgradeCommand = self.config.upgradeCommand || "git pull; npm install";

  process.on("SIGUSR1", function(){
    console.log("recieved upgrade signal");
    self.upgrade({});
  });

  process.on("SIGUSR2", function(){
    console.log("recieved restart signal");
    self.restart({});
  });

  if(config.surviveExceptions) {
    this.emit("surviveExceptions");
    process.on("uncaughtException", function(err){
      // do nothing here
    });
  }
  
  this.on("Self", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });

  if(config.siblings)
    self.startSiblings(config, this, function(c){
      self.emit({type: "Self", pid: process.pid, siblings: c.startedSiblings});
    });

}, {
  startSiblings: function(c, sender, callback){
    var self = this;
    this.emit({
      type: "Tissue",
      action: "list",
      target: c.tissue || this.config.tissue
    }, function(list){
      var siblingsNames = _.pluck(c.siblings,"name");
      var startedNames = _.pluck(list.data, "name");
      var notStartedSiblings = _.difference(siblingsNames, startedNames);
      var startedSiblings = [];
      async.forEach(notStartedSiblings, function(siblingName, next){
        var sibling = _.find(c.siblings, function(s){ return s.name == siblingName });
        var target = siblingName;
        if(!sibling.cwd)
          target = path.join(path.dirname(process.argv[1]), siblingName);
        self.emit({
          type: "Tissue",
          action: "start",
          target: target,
          cwd: sibling.cwd?path.join(path.dirname(process.argv[1]), sibling.cwd):false,
          output: sibling.output
        }, function(started){
          if(started instanceof Error) return next(started);
          startedSiblings.push(started.data);
          next();
        });
      }, function(err){
        if(callback) callback(err || {startedSiblings: startedSiblings});
      });
    });
  },
  restart: function(c, sender, callback) {
    this.emit({
      type: "Tissue",
      action: "start",
      target: process.argv[1]
    }, function(start){
      var exit = true;
      if(callback) exit = callback(start);
      if(exit)
        process.exit();
    });
  },
  upgrade: function(c, sender, callback){
    var self = this;
    fs.exists(".git", function(exists){
      if(exists) {
        self.emit({
          type: "Tissue",
          action: "start",
          exec: self.config.upgradeCommand,
        }, function(r){
          if(r instanceof Error) {
            if(callback) callback(r);
            return;
          }
          self.restart(c, sender, callback);
        });
      }
    });
  },
  registerAsService: function(c, sender, callback){
    var self = this;
    require("servicer").init(function(services){
      services.install(self.config.name, process.cwd, process.argv[1], function(err){
        callback(err);
      });
    })
  },
  unregisterAsService: function(c, sender, callback) {
    var self = this;
    require("servicer").init(function(services){
      services.uninstall(self.config.name, function(err){
        callback(err);
      });
    })
  }
})