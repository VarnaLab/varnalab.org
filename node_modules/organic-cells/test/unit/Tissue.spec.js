var fs = require('fs');

describe("Tissue", function(){
  var Tissue = require("../../membrane/Tissue");
  var Plasma = require("organic").Plasma;
  var tissue;
  var childCell;
  var plasma = new Plasma();
  var config = {}
  it("creates instance", function(){
    tissue = new Tissue(plasma, config);
  });

  it("spawns new cell from path", function(next){
    plasma.emit({type: "Tissue", action: "start", target: __dirname+"/../data/cell.js"}, this, function(c){
      expect(c instanceof Error).toBe(false);
      childCell = c.data;
      expect(fs.existsSync("cell.js.out")).toBe(true);
      expect(fs.existsSync("cell.js.err")).toBe(true);
      next();
    });
  });

  it("kills the new cell", function(next){
    setTimeout(function(){
      plasma.emit({type: "Tissue", action: "stop", target: childCell.pid}, this, function(c){
        expect(c instanceof Error).toBe(false);
        fs.unlink("cell.js.out");
        fs.unlink("cell.js.err");
        next();
      });  
    }, 2000);
  });

  it("stops all cells", function(next){
    plasma.emit({type: "Tissue", action: "stopall", target: "cell.js"}, this, function(c){
      expect(c instanceof Error).toBe(false);
      next();
    });
  })

  it("restarts all cells", function(next){
    plasma.emit({type: "Tissue", action: "restartall", target: "cell.js"}, this, function(c){
      expect(c instanceof Error).toBe(false);
      next();
    });
  })

  it("upgrades all cells", function(next){
    plasma.emit({type: "Tissue", action: "upgradeall", target: "cell.js"}, this, function(c){
      expect(c instanceof Error).toBe(false);
      next();
    });
  })

  it("execs a command", function(next){
    plasma.emit({type: "Tissue", action: "start", exec: "mkdir test"}, this, function(c){
      expect(c instanceof Error).toBe(false);
      expect(fs.existsSync(process.cwd()+"/test")).toBe(true);
      fs.rmdir(process.cwd()+"/test");
      next();
    });
  })
});