var fs = require("fs");
var path = require("path");

describe("Tissue", function(){
  var Plasma = require("organic").Plasma;
  var plasma = new Plasma();
  var Tissue = require("../../membrane/Tissue");
  var tissue = new Tissue(plasma, {});
  var siblings;

  var spawnOptions = {
    target: path.normalize(__dirname+"/../data/daemonCellSibling.js")
  }

  it("creates cell instance as daemon-sibling", function(next){
    tissue.start(spawnOptions, this, function(c){
      daemonCell = c.data;
      setTimeout(function(){
        tissue.list({target: "daemon-siblings"}, this, function(c){
          expect(c.data.length).toBe(2);
          siblings = c.data;
          next();
        })
      }, 2000);
    })
  });

  it("kills all daemon-siblings", function(next){
    siblings.forEach(function(s){
      tissue.stop({target: s.pid});
    })

    fs.unlink("daemonCellSibling.js.out");
    fs.unlink("daemonCellSibling.js.err");
    fs.unlink("daemonCellSibling2.js.out");
    fs.unlink("daemonCellSibling2.js.err");
      
    next();
  })
});