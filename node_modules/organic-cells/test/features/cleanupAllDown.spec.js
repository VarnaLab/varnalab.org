var fs = require("fs");
var path = require("path");
var request = require("request");

describe("SuvriveExceptions", function(){
  var Plasma = require("organic").Plasma;
  var plasma = new Plasma();
  var Tissue = require("../../membrane/Tissue");
  var tissue = new Tissue(plasma, {});
  var daemonCell;

  var spawnOptions = {
    target: path.normalize(__dirname+"/../data/daemonCell.js"),
    output: false
  }
  var getUserHome = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  };
  var mockGetCellMarker = function(bindTo, target, pid) {
    return path.join(getUserHome(),".organic", bindTo, path.basename(target))+"."+pid;
  };

  var crashPath1 = mockGetCellMarker("daemons", __dirname+"/../data/daemonCell.js", "1313");
  var crashPath2 = mockGetCellMarker("daemons", __dirname+"/../data/daemonCell.js", "1312");

  it("creates cell instance as daemon", function(next){
    tissue.start(spawnOptions, this, function(c){
      daemonCell = c.data;
      setTimeout(function(){
        var pid = mockGetCellMarker("daemons", spawnOptions.target, daemonCell.pid);
        expect(fs.existsSync(pid)).toBe(true);
        next();
      }, 2000);
    })
  });
  
  it("creates crashed instances of daemon", function(next){
    fs.writeFileSync(crashPath1);
    fs.writeFileSync(crashPath2);
    next();
  });
  it("cleans up", function(next){
    tissue.cleanup({target: "daemons"}, this, function(c){
      expect(c.data.length).toBe(2);
      next();
    });
  })
  it("lists the cell", function(next){
    tissue.list({target: "daemons"}, this, function(c){
      expect(c.data.length).toBe(1);
      expect(c.data[0].pid).toBe(daemonCell.pid.toString());
      next();
    });
  });
  it("kills the cell", function(next){
    tissue.stop({target: daemonCell.pid}, this, function(c){
      setTimeout(function(){
        var pid = mockGetCellMarker("daemons", spawnOptions.target, daemonCell.pid);
        expect(fs.existsSync(pid)).toBe(false);
        next();
      }, 2000);
    });
  })
});