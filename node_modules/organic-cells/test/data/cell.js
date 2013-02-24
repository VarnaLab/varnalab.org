var Cell = require("organic").Cell;
var cell = new Cell({
  membrane: {
    "HttpServer": { 
      source: "node_modules/organic-webcell/membrane/ExpressHttpServer"
    }
  }
});