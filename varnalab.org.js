#!/usr/bin/env node
var argv = require('optimist').argv;
require('coffee-script')

var util = require("util");
var Cell = require("organic-webcell/WebCell");
var DNA = require("organic").DNA;

var mongoose = require('mongoose');
var mongojs = require("mongojs");
var modelBase = require("./context/models/server/Base");

process.env.CELL_MODE = process.env.NODE_ENV || process.env.CELL_MODE || "development";

module.exports = function(callback) {
  
  var self = this;
  var bootApp = function(){
    var db = mongoose.createConnection('localhost', dna.plasma.MountHttpHelpers.dbname);
    db.once("open", function(){
      modelBase.db = db;
      Cell.call(self, dna);
      self.plasma.once("HttpServer", function(c){
        console.log(("api running in CELL_MODE == "+process.env.CELL_MODE).blue+" on port "+dna.membrane.HttpServer.port);
        if(callback) callback();
      });
    });
  }

  var dna = new DNA();
  dna.loadDir(process.cwd()+"/dna", function(){
    if(dna[process.env.CELL_MODE])
      dna.mergeBranchInRoot(process.env.CELL_MODE);

    // if PORT env variable is set, use that instead of what is defined in dna
    if(process.env.PORT) 
      dna.membrane.HttpServer.port = process.env.PORT;
    if(process.env.NODEMON)
      delete dna.plasma.Self;
    
    if(process.env.CELL_MODE == "test" || argv.cleanDB) {
      var connection = mongojs.connect(dna.plasma.MountHttpHelpers.dbname)
      connection.dropDatabase(function(){
        console.log((dna.plasma.MountHttpHelpers.dbname+" is dropped").red);
        connection.close();
        bootApp();
      });
    } else 
      bootApp();
  });
}

util.inherits(module.exports, Cell);

// start the cell if this file is not required
if(!module.parent)
  new module.exports();