var fs = require('fs');
var path = require("path");

process.env.NODE_ENV = "test";
process.env.CELL_MODE = "test";
var Api = require("../../varnalab.org");
var api;

module.exports.apiendpoint = "http://localhost:8081/api";

module.exports.boot = function(next){
  api = new Api(function(){
    console.log("api running".green);
    next();
  });
}

module.exports.kill = function(){
  api.kill();
  console.log("api killed".green);
}

var files = fs.readdirSync(__dirname);
for(var i = 0; i<files.length; i++) {
  if(files[i].indexOf(".js") === -1) continue;
  if(files[i].indexOf("index.js") !== -1) continue;
  var name = path.basename(files[i], path.extname(files[i]));
  var helper = module.exports[name] = require(__dirname+"/"+files[i]);
  for(var method in helper)
    helper[method] = helper[method].bind(module.exports);
  console.log("loaded helper:".green, name);
}

module.exports.getValidMember = function(){
  return {
    'email':'asd@asd.as',
    'password':'asdasd'
  }
}

module.exports.getValidEvent = function(){
  return {
    'title': 'happy birthday Varna Lab',
    'description': 'lets drink some beer',
    'startDateTime': new Date(),
    'endDateTime': new Date()
  }
}

module.exports.getInvalidEmail = function(){
  return 'asd';
}