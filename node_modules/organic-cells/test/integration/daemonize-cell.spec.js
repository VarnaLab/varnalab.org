var fs = require("fs");
var path = require("path");

describe("Tissue", function(){
  var Plasma = require("organic").Plasma;
  var plasma = new Plasma();
  var Tissue = require("../../membrane/Tissue");
  var tissue = new Tissue(plasma, {});
  var daemonCell;

  var spawnOptions = {
    target: path.normalize(__dirname+"/../data/daemonCell.js")
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
        expect(fs.existsSync(path.basename(spawnOptions.target)+".out")).toBe(true);
        expect(fs.existsSync(path.basename(spawnOptions.target)+".err")).toBe(true);
        next();
      }, 2000);
    })
  });
  it("lists the cell", function(next){
    tissue.list({target: "daemons"}, this, function(c){
      expect(c.data.length).toBe(1);
      expect(c.data[0].pid).toBe(daemonCell.pid.toString());
      next();
    });
  });
  it("restarts the cell", function(next){
    process.kill(daemonCell.pid, "SIGUSR2");
    setTimeout(function(){
      tissue.list({target: "daemons"}, this, function(c){
        expect(c.data.length).toBe(1);
        expect(c.data[0].pid).not.toBe(daemonCell.pid);
        daemonCell.pid = c.data[0].pid;
        next();
      })
    }, 500);
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
  it("lists no cells", function(next){
    tissue.list({target: "daemons"}, this, function(c){
      expect(c.data.length).toBe(0);
      fs.unlink(path.basename(spawnOptions.target)+".out");
      fs.unlink(path.basename(spawnOptions.target)+".err");
      next();
    });
  });
});