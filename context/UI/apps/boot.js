require("../client/vendor/jquery");
require("../client/vendor/bootstrap.min");
require("../client/vendor/bootstrap-fileupload.min");

_ = require("../client/vendor/underscore");
Backbone = require("../client/vendor/backbone");
config = require("config");

jadeCompile = function(path){
  var compiled = jade.compile(path);
  return function(data) {
    data = data || {};
    data.t = $.t;
    return compiled(data);
  }
};