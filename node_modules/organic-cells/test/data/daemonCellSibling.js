var Cell = require("organic").Cell;
var cell = new Cell({
  membrane: {
    "HttpServer": { 
      source: "node_modules/organic-webcell/membrane/ExpressHttpServer"
    },
    "Tissue": {
      "source": "membrane/Tissue",
      "bindTo": "daemon-siblings"
    }
  },
  plasma: {
    "Self": {
      "source": "plasma/Self",
      "tissue": "daemon-siblings",
      "siblings": [
        {
          name: "daemonCellSibling2.js"
        }
      ]
    }
  }
});