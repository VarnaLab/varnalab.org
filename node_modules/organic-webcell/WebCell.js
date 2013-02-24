#!/usr/bin/env node
var mode = process.env.CELL_MODE || "development";

var util = require("util");
var Cell = require("organic").Cell;
var DNA = require("organic").DNA;
var Chemical = require("organic").Chemical;

module.exports = function WebCell(dna, callback) {
  if(dna) {
    Cell.call(this, dna);
    if(callback) callback();
  } else {
    var self = this;
    dna = new DNA();
    dna.loadDir(process.cwd()+"/dna", function(){
      if(dna[mode])
        dna.mergeBranchInRoot(mode);
      Cell.call(self, dna);
      if(callback) callback();
    });
  }
}

util.inherits(module.exports, Cell);

module.exports.prototype.kill = function(){
  this.plasma.emit("kill");
}

// start the cell if this file is not required
if(!module.parent) {
  console.log("creating WebCell in "+mode);
  new module.exports();
}