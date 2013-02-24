var root = "../../../";
var Chemical = require("organic").Chemical;
var Plasma = require("organic").Plasma;
var WebSocketServer = require(root+"membrane/WebSocketServer");
var CallAction = require(root+"plasma/CallAction");
var io = require("socket.io-client");

var plasma = new Plasma();
var config = {
  "port": 8084,
  "socketio": {
    "close timeout": 1
  },
  "events": {
    "myMessage": {
      "type": "CallAction",
      "action": "/tests/data/RealtimeAction"
    }
  }
}

var CallActionConfig = {

}

var server;
var callAction;

describe("RealtimeCallAction", function(){

  it("should create new instance", function(){
    server = new WebSocketServer(plasma, config);
    server = new CallAction(plasma, CallActionConfig);
    expect(server).toBeDefined();
    expect(server).toBeDefined();
  });

  it("should handle incoming connection", function(next){
    var client = io.connect( "http://localhost", { port: config.port ,  'reconnect': false, 'force new connection': true});
    plasma.once("socketConnection", function(c){
      expect(c.data).toBeDefined();
      client.disconnect();
      next();
    });
  });

  it("should handle incoming message", function(next){
    client = io.connect( "http://localhost", { port: config.port ,  'reconnect': false, 'force new connection': true});
    client.on("connect", function(){
      client.emit("myMessage", "hello", function(err, data){
        expect(data).toBe("hello world");
        client.disconnect();
        next();
      });
    });
  });

  it("should close on receiving kill", function(){
    plasma.emit(new Chemical("kill"));
  })
});