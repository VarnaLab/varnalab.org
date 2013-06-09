require('coffee-script')

var fs = require("fs");

var DNA = require("organic").DNA;

var mongoose = require('mongoose');
var modelBase = require("../../context/models/server/Base");

var dna = new DNA();

var spendJSON = JSON.parse(fs.readFileSync(__dirname+"/spend.json"));
var incomeJSON = JSON.parse(fs.readFileSync(__dirname+"/income.json"));

dna.loadDir(__dirname+"/../../dna", function(){

  if(dna[process.env.CELL_MODE])
    dna.mergeBranchInRoot(process.env.CELL_MODE);

  var db = mongoose.createConnection('localhost', dna.plasma.MountHttpHelpers.dbname);
  db.once("open", function(){
    modelBase.db = db;

    require("./income")(incomeJSON, function(){
      require("./outcome")(spendJSON, function(){
        console.log("DONE");
      })
    })
  });
});