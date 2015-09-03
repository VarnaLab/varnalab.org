var fs = require('fs');
var path = require("path");
var request = require('request');
var wrench = require("wrench");
var Faker = require('Faker');

process.env.CELL_MODE = process.env.CELL_MODE || "_test"
var Cell = require("../../index")
var cell;

module.exports.apiendpoint = "http://localhost:8081/api";

module.exports.cleanUploads = function(){
  if(fs.existsSync(path.join(process.cwd(),"tests","uploads")))
    wrench.rmdirSyncRecursive(path.join(process.cwd(),"tests","uploads"));
  wrench.mkdirSyncRecursive(path.join(process.cwd(),"tests","uploads"));
}

module.exports.boot = function(next){
  require("jasmine-matchers");
  cell = new Cell();
  cell.plasma.on(["ExpressServer", "ApiRoutesReady", "SiteRoutesReady", "StaticPagesReady"], function(){
    module.exports.cleanUploads()
    next()
  });
  cell.start()
}

module.exports.kill = function(next){
  cell.stop(function(){
    next();
  });
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

module.exports.shortText = 'asd';
module.exports.longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in justo felis. Fusce ut iaculis urna. Sed suscipit dolor felis, non vehicula turpis mattis eget. Etiam a magna et quam ullamcorper placerat. Sed et elit egestas, fringilla ligula id, blandit magna. Pellentesque cursus eget turpis sit amet blandit. Suspendisse potenti. Suspendisse pharetra bibendum lectus in mattis. Duis sodales sit amet est ut condimentum.\
Suspendisse in luctus lacus. Vivamus interdum sollicitudin arcu eu molestie. Cras a accumsan enim, eu interdum massa. Vivamus porttitor blandit nunc, non pulvinar ipsum mollis eget. Quisque ullamcorper consectetur dui, nec pulvinar lectus. Quisque interdum nulla sem, sit amet ultrices enim tempor sed. Praesent bibendum metus id nunc suscipit commodo. Nam feugiat lobortis magna sed tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut nec velit mauris. Pellentesque vel lacinia nisl. Suspendisse velit sapien, porta sed ornare quis, pellentesque vel tellus. Phasellus nibh lorem, congue ac tortor euismod, convallis luctus lectus. Phasellus in lacus semper, semper elit congue, elementum orci. Phasellus commodo porta risus, eu pretium turpis venenatis ac.';

module.exports.getValidMember = function(){
  return {
    'email':Faker.Internet.email(),
    'password':'asdasd',
    'accessToken': '1'
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

module.exports.getValidTransaction = function(){
  return {
    'from': 'VarnaLab',
    'to': 'eon',
    'reason': 'tok',
    'amount': 146,
    'forDate': new Date()
  }
}

module.exports.getInvalidEmail = function(){
  return 'asd';
}

module.exports.createUser = function(requestModule, callback) {
  if(typeof requestModule == "function" && !callback) {
    callback = requestModule
    requestModule = request
  }

  requestModule.post({
    uri: module.exports.apiendpoint+"/members/register",
    json: module.exports.getValidMember()
  }, function(err, res, body){
    expect(err).toBeNull();
    expect(body.result).toBeDefined();
    if(err) return callback(err);
    callback(body.result);
  });
}
