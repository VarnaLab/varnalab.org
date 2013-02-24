var CallAction = require("../../plasma/CallAction");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("CallAction", function(){
  
  var plasma = new Plasma();
  var config = {
    "apiEndpoint" : "http://something.com"
  };
  
  var callAction = new CallAction(plasma, config);
  
  it("should invoke MockHandler on CallAction chemical", function(next){
    plasma.emit(new Chemical({
      type: "CallAction",
      action: "/tests/data/LogicAction"
    }), function(chemical){
      expect(chemical.data).toBeDefined();
      expect(chemical.data.test).toBe(config.apiEndpoint);
      next();
    });
  });  

  it("should invoke series of handlers on CallAction chemical", function(next){
    plasma.emit(new Chemical({
      type: "CallAction",
      action: ["/tests/data/LogicAction", "/tests/data/LogicAction2"]
    }), function(chemical){
      expect(chemical.data).toBeDefined();
      expect(chemical.data.test).toBe(config.apiEndpoint);
      expect(chemical.data.test2).toBe(config.apiEndpoint);
      next();
    });
  })

});