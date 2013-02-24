var Chemical = require("organic").Chemical;
var Plasma = require("organic").Plasma;
var MongoStore = require("../../membrane/MongoStore");
var _ = require("underscore");

describe("MongoStore", function(){
  var plasma = new Plasma();
  var mongoStore;

  var MongoStoreChem = Chemical.extend(function(method, collection, data, body){
    this.type = "MongoStore";
    this.method = method;
    this.collection = collection;
    this.data = data;
    this.body = body;
  });

  var config = {
    "dbname": "test-db"
  }

  var sampleDoc = {
    title: "string",
    value: new Date()
  }

  it("should be able to create new instance", function(){
    mongoStore = new MongoStore(plasma, config);
  });

  it("should be able to save document", function(next){
    plasma.emit(new MongoStoreChem("save", "test", sampleDoc), function(c){
      expect(c.result).toBeDefined();
      expect(c.result._id).toBeDefined();
      expect(c.result.title).toBe(sampleDoc.title);
      expect(c.result.value).toBe(sampleDoc.value);
      next();
    });
  });

  it("should be able to get document by id", function(next){
    plasma.emit(new MongoStoreChem("find", "test", sampleDoc._id.toString() ), function(c){
      expect(c.result).toBeDefined();
      expect(c.result._id.toString()).toBe(sampleDoc._id.toString());
      expect(c.result.title).toBe(sampleDoc.title);
      expect(c.result.value.toString()).toBe(sampleDoc.value.toString());
      next();
    });
  });

  it("should be able to find documents by pattern", function(next){
    plasma.emit(new MongoStoreChem("save", "test", { title: "string2", value: sampleDoc.value }), function(c){
      plasma.emit(new MongoStoreChem( "find", "test", { "value": sampleDoc.value }), function(c) {
        expect(c.result).toBeDefined();
        expect(c.result.length).toBe(2);
        c.result.forEach(function(item){
          expect(item.value.toString()).toBe(sampleDoc.value.toString());
        });
        next();
      });
    });
  });

  it("should be able to update document by id", function(next){
    var updateData = {
      $set: {
        title: "string2"
      }
    }

    plasma.emit(new MongoStoreChem("update", "test", sampleDoc._id.toString(), updateData), function(c){
      expect(c.result).toBeDefined();
      expect(c.result).toBe(1);
      next();
    });
  });

  it("should be able to remove document by id", function(next){

    plasma.emit(new MongoStoreChem("remove", "test", sampleDoc._id.toString()), function(c){
      expect(c.result).toBeDefined();
      expect(c.result).toBe(1);
      next();
    });
  });

  it("should be able to be killed", function(){
    plasma.emit(new Chemical("kill"));
  });
});