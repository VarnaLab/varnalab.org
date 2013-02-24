var HttpServer = require("../../membrane/ExpressHttpServer");
var Plasma = require("organic").Plasma;
var request = require("request");

describe("HttpServer", function(){
  
  var plasma = new Plasma();
  
  var httpServer;
  var serverConfig = {
    "port": 8080,
    "routes": {
      "/": {
        "type": "step1"
      }
    },
    "notfoundRoute": {
      "type": "notFound"
    }
  };
  var mockRequest = { url: "myRequest" };
  var mockResponse = { send: function(){} };

  it("should emit HttpServer chemical in plasma once ready", function(next){

    plasma.once("HttpServer", function(chemical){
      expect(chemical.data).toBe(httpServer);
      next();
    });

    httpServer = new HttpServer(plasma, serverConfig);
    expect(httpServer).toBeDefined();
  });

  it("should emit chemical 1 from chain on incoming request", function(next){
    plasma.once("step1", function(chemical){
      expect(chemical.req).toBeDefined();
      expect(chemical.req.url).toBe("myRequest");
      next();
    });
    // mock req & res
    httpServer.handleIncomingRequest(serverConfig.routes["/"], mockRequest, mockResponse);
  });

  it("should emit chemical notfound from chain on not found route for request", function(next){
    plasma.once("notFound", function(chemical){
      expect(chemical.req).toBeDefined();
      expect(chemical.req.url).toBe("myRequest");
      next();
    });

    // mock req & res
    httpServer.handleIncomingRequest(serverConfig.notfoundRoute, mockRequest, mockResponse);
  });

  it("should close successfully", function(){
    plasma.emit("kill");
    expect(httpServer.closed).toBe(true);
  });

});