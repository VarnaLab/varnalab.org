var Chemical = require("organic").Chemical;
var Logger = require("../../membrane/Logger");
var Plasma = require("organic").Plasma;

describe("Logger", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      root: "/tests/data/less/"
    },
    "listenUncaughtExceptions": true,
    "prefixConsoleWithTimestamps": true,
    "attachHttpServerErrorMiddleware": true
  };

  var logger = new Logger(plasma, config);

  it("should console log", function(next){
    plasma.emit(new Chemical({
      type: "Logger",
      test: true
    }), function(chemical){
      expect(chemical instanceof Error).toBe(false);
      next();
    });
  });

  it("should attach to HttpServer chemical error middleware", function(next){
    plasma.emit(new Chemical({
      type: "HttpServer",
      data: {
        app: {
          use: function(callback) {
            expect(callback).toBeDefined();
            next();
          }
        }
      }
    }))
  })

  it("should trap exception", function(){
    process.emit("uncaughtException", new Error("custom exception"));
  });

});