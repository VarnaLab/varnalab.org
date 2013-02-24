var root = "../../../";
var Chemical = require("organic").Chemical;
var Plasma = require("organic").Plasma;
var HttpServer = require(root+"membrane/ExpressHttpServer");
var CallAction = require(root+"plasma/CallAction");
var request = require("request");

var plasma = new Plasma();
var config = {
  "port": 8085,
  "routes": {
    "/myMessage": {
      "type": "CallAction",
      "action": "/tests/data/HttpAction"
    }
  }
}

var CallActionConfig = {
  "dbname": "content"
}

var server;
var CallAction;

describe("HttpCallAction", function(){

  it("should create new instance", function(){
    server = new HttpServer(plasma, config);
    callAction = new CallAction(plasma, CallActionConfig);
    expect(server).toBeDefined();
    expect(callAction).toBeDefined();
  });

  it("should handle incoming request", function(next){
    request("http://127.0.0.1:"+config.port+"/myMessage", function(err, res, body){
      expect(body).toBe("content");
      next();
    });
  });

  it("should close on receiving kill", function(){
    plasma.emit(new Chemical("kill"));
  })
});