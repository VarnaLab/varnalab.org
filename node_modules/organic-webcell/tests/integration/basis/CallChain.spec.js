var root = "../../../";
var CallChain = require(root+"plasma/CallChain");
var CallAction = require(root+"plasma/CallAction");
var BundleCode = require(root+"plasma/BundleCode");
var RenderPage = require(root+"plasma/RenderPage");

var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("CallAction", function(){
  
  var plasma = new Plasma();
  var config = {
    source: "plasma/CallChain"
  };
  
  var callChain = new CallChain(plasma, config);
  var bundleCode = new BundleCode(plasma, {cwd: {
    root: "/tests/data/client/",
  }});
  var renderPage = new RenderPage(plasma, {cwd: {
    root: "/tests/data/client/",
  }});
  var callAction = new CallAction(plasma, {
    apiEndpoint: "TEST"
  });
  
  it("should call chain", function(next){
    plasma.emit(new Chemical({
      type: "CallChain",
      chain: [{
        type: "CallAction",
        action: "/tests/data/LogicAction"
      }, {
        type: "BundleCode",
        code: "index"
      }, {
        type: "RenderPage",
        page: "index2"
      }]
    }), function(chemical){
      expect(chemical.data).toBeDefined();
      expect(chemical.data).toContain("var index");
      expect(chemical.data).toContain("div");
      expect(chemical.data).toContain("index2");
      next();
    });
  });

});