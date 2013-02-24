var organic = require("organic");
var path = require('path');

describe("Self", function(){
  var Self = require("../../plasma/Self");
  var plasma = new organic.Plasma();

  it("creates instance", function(next) {
    instance = new Self(plasma, {
      name: "testSelf"
    });
    expect(instance instanceof Self).toBe(true);
    next();
  });

  it("restarts", function(next){
    plasma.once("Tissue", function(c, sender, callback){
      expect(sender instanceof Self).toBe(true);
      expect(c.target).toBe(process.argv[1]); // self
      callback({data: {pid: "fake"}});
    });
    plasma.emit({
      type: "Self",
      action: "restart"
    }, this, function(c){
      expect(c instanceof Error).toBe(false);
      expect(c.data.pid).toBe("fake");
      next();
      return false; // do not exit the process
    })
  })

  it("upgrades", function(next){
    var tissueMockUp = function(c, sender, callback){
      expect(sender instanceof Self).toBe(true);
      if(c.exec)
        expect(c.exec).toBe("git pull; npm install");
      if(c.target)
        expect(c.target).toBe(process.argv[1]); // self
      callback({data: {pid: "fake"}});
    };
    plasma.on("Tissue", tissueMockUp);
    plasma.emit({
      type: "Self",
      action: "upgrade"
    }, this, function(c){
      expect(c instanceof Error).toBe(false);
      expect(c.data.pid).toBe("fake");
      plasma.off("Tissue", tissueMockUp);
      next();
      return false; // do not exit the process
    })
  });

  it("starts siblings", function(next){
    plasma.on("Tissue", function(c, sender, callback){
      if(c.action == "list")
        return callback({data: [{ name: "test1.js" }]});
      if(c.action == "start")
        return callback({data: {target: c.target, cwd: c.cwd, output: c.output}});
    });
    plasma.emit({
      type: "Self",
      action: "startSiblings",
      tissue: "mockup",
      siblings: [
        { name: "test1.js", cwd: "test" },
        { name: "test2.js", cwd: "test" },
        { name: "test3.js", output: false }
      ]
    }, function(c){
      expect(c instanceof Error).toBe(false);
      expect(c.startedSiblings.length).toBe(2);
      var siblings = c.startedSiblings;
      expect(siblings[0].target).toBe("test2.js");
      expect(siblings[0].cwd).toBe(path.join(path.dirname(process.argv[1]), "test"));
      expect(siblings[1].target).toBe(path.join(path.dirname(process.argv[1]), "test3.js"));
      expect(siblings[1].cwd).toBe(false);
      expect(siblings[1].output).toBe(false);
      next();
    })
  })

});