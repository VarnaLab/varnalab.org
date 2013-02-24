var Handlebars = require('handlebars')
  , fs = require('fs')
  , path = require('path')
  , exec = require("child_process").exec;


module.exports.init = function(callback){
  var template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, '../templates/serviceName.plist.hbs'), 'utf8'));
  var instance = {
    start: function(serviceName, next){
      var p = "/Library/LaunchDaemons/"+serviceName+".service.plist";
      exec("launchctl unload -w "+p, next);
    },
    stop: function(serviceName, next) {
      var p = "/Library/LaunchDaemons/"+serviceName+".service.plist";
      exec("launchctl load -w "+p, next);
    },
    install: function(serviceName, appFolder, appFile, next) {
      var p = "/Library/LaunchDaemons/"+serviceName+".service.plist";
      var data = {
        name: serviceName,
        appFolder: appFolder,
        appFile: appFile,
        nodeLocation: process.argv[0],
        user: process.env['USER']
      }
      data = template(data);
      fs.writeFile(p, data, next);
    },
    uninstall: function(serviceName, next) {
      var p = "/Library/LaunchDaemons/"+serviceName+".service.plist";
      fs.unlink(p, next);
    }
  }
  callback(instance);
}