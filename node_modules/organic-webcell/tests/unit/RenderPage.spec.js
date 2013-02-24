var RenderPage = require("../../plasma/RenderPage");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("RenderPage", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      "root": "/tests/data/client/"  
    },
    jadeConfig: {
      pretty: true
    }
  };

  var renderPage = new RenderPage(plasma, config);
  
  it("should get user session on PageData chemical", function(next){
    plasma.emit(new Chemical({
      type: "RenderPage",
      page: "index"
    }), function(chemical){
      expect(chemical.data).toBeDefined();
      expect(chemical.data).toContain("index");
      next();
    });
  });  

});