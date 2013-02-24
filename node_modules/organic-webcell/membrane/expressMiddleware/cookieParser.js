var express = require('express');

module.exports = function(config, httpServer){
  return express.cookieParser();
}