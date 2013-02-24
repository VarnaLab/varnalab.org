var express = require('express');

module.exports = function(config, httpServer) {
  var target = config.staticDir;
  if(target.indexOf("/") !== 0)
    target = process.cwd()+"/"+target;
  return express.static(target);
}