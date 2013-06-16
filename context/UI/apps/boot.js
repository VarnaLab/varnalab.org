require("./vendor/jquery");
require("./vendor/bootstrap.min");

_ = require("./vendor/underscore");
Backbone = require("./vendor/backbone");
config = require("config");

jadeCompile = function(path){
  var compiled = jade.compile(path);
  return function(data) {
    data = data || {};
    data.t = $.t;
    return compiled(data);
  }
};