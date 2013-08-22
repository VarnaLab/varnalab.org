#!/usr/bin/env node
require('coffee-script')

var util = require("util");
var _ = require("underscore");
var DNA = require("organic").DNA;
var Plasma = require("organic").Plasma;
var Cell = require("organic").Cell;

process.env.CELL_MODE = process.env.CELL_MODE || "development";

var prepareDNA = function(dna){
  // preselect cell dna based on its mode
  if(dna[process.env.CELL_MODE])
      dna.mergeBranchInRoot(process.env.CELL_MODE);

  // if PORT env variable is set, use that instead of what is defined in dna
  if(process.env.PORT) 
    dna.membrane.HttpServer.port = process.env.PORT;

  if(process.env.NODEMON)
    delete dna.plasma.Self;

  // inject db name into session middleware
  var sessionsMiddleware = _.find(dna.membrane.HttpServer.middleware, function(item){
    return item.source && item.source.indexOf("handleMongoSession") !== -1;
  })
  if(sessionsMiddleware && dna.database)
    sessionsMiddleware.dbname = dna.database.name;

  // inject uploads path into body parser middleware
  var bodyParserMiddleware = _.find(dna.membrane.HttpServer.middleware, function(item){
    return item.source && item.source.indexOf("bodyParser") !== -1;
  })
  if(bodyParserMiddleware && dna.uploads)
    bodyParserMiddleware.uploadDir = dna.uploads.path;

  // inject database name into Mongoose organelle
  if(dna.membrane.Mongoose && dna.database)
    dna.membrane.Mongoose.database.name = dna.database.name;
}

module.exports = function() {
  var self = this;

  // plasma is required, so that tests can take back result chemicals
  self.plasma = new Plasma(); 

  // breaking the 'rules' due test-ability
  this.dna = new DNA();

  this.dna.loadDir(process.cwd()+"/dna", function(){

    prepareDNA(self.dna);
    Cell.call(self, self.dna); // initial Cell construction

    self.plasma.emit({type: "build", branch: "membrane"}); // build membrane organelles
    self.plasma.emit({type: "build", branch: "plasma"}); // build plasma organelles
  });
}

util.inherits(module.exports, Cell);

module.exports.prototype.kill = function(){
  this.plasma.emit("kill");
}

// start the cell if this file is not required
if(!module.parent)
  new module.exports();