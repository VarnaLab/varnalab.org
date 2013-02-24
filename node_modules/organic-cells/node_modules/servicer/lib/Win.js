// Thanks to https://github.com/jfromaniello/winser, Copyright (c) 2011 Jose Romaniello <jfromaniello@gmail.com>
// rewrite by Boris Filipov

var fs = require("fs"),
    exec = require("child_process").exec,
    path = require("path");

String.prototype.supplant = function (o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === "string" || typeof r === "number" ? r : a;
    }
  );
};

module.exports.init = function(callback){
  var nodeLocation;
  var instance = {
    start: function(serviceName, next){
      exec("net start " + serviceName, next);
    },
    stop: function(serviceName, next){
      exec("net stop " + serviceName, next);
    },
    install: function(serviceName, appFolder, appFile, next){
      // http://support.microsoft.com/kb/251192
    },
    uninstall: function(serviceName, next){
      // http://support.microsoft.com/kb/251192
    }
  }
  exec("whoami /groups | findstr /c:\"S-1-5-32-544\" | findstr /c:\"Enabled group\"", function(err, r){
    if(r.length === 0){
      log("You must run this tool as an administrator");
      process.exit();
    }else{
      exec("where node.cmd", function(err, r){
        nodeLocation = r.trim().split("\r\n")[0];
        callback(instance);
      });
    }
  });
}