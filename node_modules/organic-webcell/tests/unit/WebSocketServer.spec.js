var Chemical = require("organic").Chemical;
var Plasma = require("organic").Plasma;
var WebSocketServer = require("../../membrane/WebSocketServer");
var io = require("socket.io-client");

describe("WebSocketServer", function(){
  var plasma = new Plasma();
  var config = {
    "port": 8083,
    "socketio": {
      "close timeout": 1
    },
    "events": {
      "message": {
        "type": "step1"
      },
      "hello": {
        "type": "step2"
      }
    }
  }

  var server;

  it("should create new instance", function(){
    server = new WebSocketServer(plasma, config);
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
    plasma.once("step1", function(c){
      expect(c.data).toBe("hello world");
      expect(c.connection).toBeDefined();
      client.disconnect();
      next();
    });
    client = io.connect( "http://localhost", { port: config.port ,  'reconnect': false, 'force new connection': true});
    client.on("connect", function(){
      client.emit("message", "hello world");
    });
  });

  it("should handle incoming hello", function(next){
    plasma.once("step2", function(c){
      expect(c.mydata).toBe("hello world");
      expect(c.connection).toBeDefined();
      client.disconnect();
      next();
    });
    client = io.connect( "http://localhost", { port: config.port ,  'reconnect': false, 'force new connection': true});
    client.on("connect", function(){
      client.emit("hello", {mydata: "hello world"});
    });
  });

  it("should close on receiving kill", function(){
    plasma.emit(new Chemical("kill"));
  });
});