var BundleCode = require("../../plasma/BundleCode");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("BundleCode", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      "root": "/tests/data/client/",
    },
    "useCache": false
  };
  var mockRequest = { url: "myRequest", headers: {} };
  var mockResponse = { send: function(){} };

  var bundleCode = new BundleCode(plasma, config);
  
  it("should get user session on PageData chemical", function(next){
    plasma.emit(new Chemical({
      type: "BundleCode",
      code: "index",
    }), function(chemical){
      expect(chemical.data.toString()).toBeDefined();
      expect(chemical.data.toString()).toContain("index");
      next();
    });
  });  

});