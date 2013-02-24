var Cell = require("organic").Cell;
var cell = new Cell({
  membrane: {
    "HttpServer": { 
      "source": "node_modules/organic-webcell/membrane/ExpressHttpServer",
      "port": "1234",
      "routes": {
        "/": {
          "type": "throwException"
        }
      }
    },
    "Tissue": {
      "source": "membrane/Tissue",
      "bindTo": "daemons"
    }
  },
  plasma: {
    "Self": {
      "source": "plasma/Self",
      "tissue": "daemons",
      "surviveExceptions": true
    }
  }
});
cell.plasma.on("throwException", function(c){
  process.nextTick(function(){
    nonexistentFunc();  
  })
})