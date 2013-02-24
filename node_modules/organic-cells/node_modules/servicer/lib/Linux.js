var Handlebars = require('handlebars')
  , fs = require('fs')
  , path = require('path')
  , exec = require("child_process").exec;


module.exports.init = function(callback){
  var template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, '../templates/serviceName.conf.hbs'), 'utf8'));
  var instance = {
    start: function(serviceName, next){
      exec("sudo service "+serviceName+" start", next);
    },
    stop: function(serviceName, next) {
      exec("sudo service "+serviceName+" stop", next);
    },
    install: function(serviceName, appFolder, appFile, next) {
      var p = serviceName + '.conf';
      var data = {
        name: serviceName,
        description: "node "+appFolder+appFile,
        author: "node "+appFolder+appFile,
        appFolder: appFolder,
        appFile: appFile,
        nvm: "/home/"+process.env['USER']+"/.nvm",
        user: process.env['USER']
      }
      data = template(data);
      fs.writeFile(p, data, function(err){
        if(err) return next(err);
        exec("sudo mv "+p+" /etc/init/"+p, next);  
      });
    },
    uninstall: function(serviceName, next) {
      var p = '/etc/init/' + serviceName + '.conf';
      exec("sudo rm "+p, next);
    }
  }
  callback(instance);
}