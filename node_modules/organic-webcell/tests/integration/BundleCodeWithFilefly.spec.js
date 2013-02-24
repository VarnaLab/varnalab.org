var BundleCode = require("../../plasma/BundleCode");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;
var path = require("path");

xdescribe("BundleCode", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      "root": "/tests/data/client/",
    },
    "useCache": false,
    "debug": false,
    "plugins": [
      {
        "source": "/tests/fileify",
        "arguments": ["files", "/tests/data/templates"]
      }
    ]
  };

  var bundleCode = new BundleCode(plasma, config);
  
  it("should get user session on PageData chemical", function(next){
    plasma.emit(new Chemical({
      type: "BundleCode",
      code: "/indexPluggins",
    }), function(chemical){
      expect(chemical.data.toString()).toBeDefined();
      expect(chemical.data.toString()).toContain("index");
      expect(chemical.data.toString()).toContain("files");
      expect(chemical.data.toString()).toContain("1");
      expect(chemical.data.toString()).toContain("2");
      expect(chemical.data.toString()).toContain("3");
      next();
    });
  });  

});