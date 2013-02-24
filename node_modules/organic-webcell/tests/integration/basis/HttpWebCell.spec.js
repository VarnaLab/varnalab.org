var root = "../../../";
var Cell = require(root+"WebCell");
var Chemical = require("organic").Chemical;
var request = require("request");

describe("ClientPage", function(){
  
  var cell;

  var dnaData = {
    "membrane":{
      "HttpServer": {
        "source": "membrane/ExpressHttpServer",
        "port": 8079,
        "staticFolder": "/tests/data/client/public",
        "localesFolder": "/tests/data/client/public/locales",
        "routes":{
          "*": {
            "type": "RenderPage",
            "page": "index"
          }
        },
      }
    },
    "plasma": {
      "RenderPage": {
        "source": "plasma/RenderPage",
        "cwd": {
          "root": "/tests/data/client/"
        }
      }
    }
  };

  it("should start", function(next){
    cell = new Cell(dnaData);
    cell.plasma.once("HttpServer", function(chemical){
      expect(chemical).toBeDefined();
      next();
    });
    cell.plasma.on(Error, function(e){
      throw e;
    })
  });

  it("should emit rendered page", function(next){
    request("http://localhost:"+dnaData.membrane.HttpServer.port+"/", function(err, res, body){
      expect(body).toContain("<div class");
      expect(body).toContain("index");
      cell.kill();
      next();
    });
  });

});