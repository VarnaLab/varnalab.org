var root = "../../";
var Cell = require(root+"WebCell");
var Chemical = require("organic").Chemical;
var request = require("request");

describe("ClientPage", function(){
  
  var cell;

  var dnaData = {
    "membrane":{
      "MongoStore": {
        "source": "membrane/MongoStore",
        "dbname": "test"
      }
    }
  };

  it("should start", function(next){
    cell = new Cell(dnaData);
    next();
  });

  it("should end", function(next){
    cell.kill();
    next();
  })

});