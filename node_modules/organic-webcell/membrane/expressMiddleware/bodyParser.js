var express = require('express');

module.exports = function(config, httpServer){
  options = config || {};
  if(options.uploadDir && options.uploadDir.indexOf("/") !== 0)
    options.uploadDir = process.cwd()+"/"+options.uploadDir;

  return express.bodyParser(options);
};