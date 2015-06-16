var Whoisatvarnalab = require("../../plasma/whoisatvarnalab")
var Plasma = require("organic-plasma")

describe("whoisatvarnalab", function(){
  var plasma = new Plasma()
  var instance
  it("initializes", function(next){
    var dna = {
      emitReady: "ready",
      auth: require("../../dna/_test/secrets.json")["mikrotek-api"]
    }
    instance = new Whoisatvarnalab(plasma, dna)
    plasma.on(dna.emitReady, function(c){
      next()
    })
  })
  it("updates", function(next){
    instance.update({}, function(){
      expect(instance.peopleOnline.length > 0).toBe(true)
      expect(instance.peopleOnline[0].host).toBeDefined()
      expect(instance.peopleOnline[0].mac).toBeDefined()
      expect(instance.peopleOnline[0].ip).toBeDefined()
      next()
    })
  })
  it("kills", function(next){
    instance.kill({}, next)
  })
})