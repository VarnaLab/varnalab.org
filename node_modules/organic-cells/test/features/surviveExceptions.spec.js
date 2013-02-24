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
    target: path.normalize(__dirname+"/../data/surviveExceptionsCell.js"),
    output: false
  }
  var getUserHome = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  };
  var mockGetCellMarker = function(bindTo, target, pid) {
    return path.join(getUserHome(),".organic", bindTo, path.basename(target))+"."+pid;
  };

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
  
  it("triggers error", function(next){
    request.get("http://localhost:1234", function(err, res, body){
      
    })
    setTimeout(next, 2000);
  });
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