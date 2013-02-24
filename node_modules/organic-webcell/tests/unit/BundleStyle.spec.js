var Chemical = require("organic").Chemical;
var BundleStyle = require("../../plasma/BundleStyle");
var Plasma = require("organic").Plasma;
var fs = require("fs");

describe("BundleStyle", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      root: "/tests/data/less/"
    }
  };

  var bundleStyle = new BundleStyle(plasma, config);

  it("should compile less with default config", function(next){
    plasma.emit(new Chemical({
      type: "BundleStyle",
      style: "src/main.less",
    }), function(chemical){
      expect(chemical instanceof Error).toBe(false);
      expect(chemical).toBeDefined();
      expect(chemical.data).toContain(".my-new-style");
      expect(chemical.data).toContain(".footer");
      expect(chemical.data).toContain(".footer {\n  margin: 10px;\n  display: block;");
      next();
    });
  });

});