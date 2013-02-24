var root = "../../../";
var request = require("request");
var Cell = require(root+"WebCell");
var Chemical = require("organic").Chemical;

describe("ClientPage", function(){
  
  var cell;
  var dnaData = {
    "membrane":{
      "HttpServer": {
        "source": "membrane/ExpressHttpServer",
        "port": 8078,
        "staticFolder": "/tests/data/client/public",
        "localesFolder": "/tests/data/client/public/locales",
        "routes": {
          "/": {
            "type": "RenderPage",
            "page": "index",
          },
          "/code": {
            "type": "BundleCode",
            "code": "index"
          }
        },
      }
    },
    "plasma": {
      "BundleCode": {
        "source": "plasma/BundleCode",
        "cwd": {
          "root": "/tests/data/client/",
        },
        "useCache": false
      },
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
  });

  it("should return rendered page as response on request", function(next){
    request("http://localhost:"+dnaData.membrane.HttpServer.port+"/", function(err, res, body){
      expect(err).toBe(null);
      expect(body).toContain("index");
      expect(body).toContain("<div class");
      expect(body).toContain("container");
      next();
    }); 
  });

  it("should return rendered code as response on request", function(next){
    request("http://localhost:"+dnaData.membrane.HttpServer.port+"/code", function(err, res, body){
      expect(err).toBe(null);
      expect(body).toContain('var index = "index";');
      cell.kill();
      next();
    }); 
  });

});