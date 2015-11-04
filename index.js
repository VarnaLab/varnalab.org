require('coffee-script')

var Nucleus = require("organic-nucleus")
var Plasma = require("organic-plasma")
var DNA = require("organic").DNA
var loadDir = require("organic-dna-fsloader").loadDir
var selectBranch = require("organic-dna-branches").selectBranch
var path = require("path")
var _ = require("underscore")

var resolveReferences = require("organic-dna-resolvereferences")
var foldAndMerge = require("organic-dna-fold")
var replacePlaceholders = require('./lib/replace-placeholders')

process.env.CELL_MODE = process.env.CELL_MODE || "_development";

module.exports = function(){
  var self = this;
  this.plasma = new Plasma()
  if(process.env.TRACEPLASMA)
    this.plasma.pipe(function(c){
      process.stdout.write(JSON.stringify(c)+"\n")
    })
}

module.exports.prototype.build = function(dna) {
  var self = this
  // # prepere dna

  // fold dna based on cell mode
  if(dna[process.env.CELL_MODE]) {
    foldAndMerge(dna, selectBranch(dna, process.env.CELL_MODE))
  }

  // resolve any referrences
  resolveReferences(dna)

  replacePlaceholders(dna.fronturls, dna.fronturls)

  // # construct core
  var nucleus = new Nucleus(this.plasma, dna)

  // # provide self-build pipeline via nucleus
  this.plasma.on("build", function(c, next){
    nucleus.build(c, next)
  })

  // # build cell
  this.plasma.emit({type: "build", branch: "processes.index.plasma"}, function(err){
    if(err) throw err
    self.plasma.emit({type: "build", branch: "processes.index.membrane"}, function(err){
      if(err) throw err
    })
  })


  // # listen for external interruptions
  this.signintHandler = function(){
    self.stop(function(){
      process.exit()
    })
  }
  process.on("SIGINT", this.signintHandler)
}

module.exports.prototype.on = function(pattern, handler, context) {
  this.plasma.on(pattern, handler, context)
}

module.exports.prototype.start = function(dna, next){
  if(typeof dna == "function") { next = dna; dna = null }

  var self = this
  if(!dna) {
    var dna = new DNA()
    loadDir(dna, path.join(__dirname,"dna"), function(err){
      if(err) return next(err)
      self.build(dna)
      next && next(null, dna)
    })
  } else {
    this.build(dna)
    next && next(null, dna)
  }
}

module.exports.prototype.stop = function(next){
  process.removeListener("SIGINT", this.signintHandler)
  this.plasma.emitAndCollect("kill", next)
}

if(!module.parent) {
  var instance = new module.exports()
  instance.start(function(err){
    if(err) throw err
  })
}
