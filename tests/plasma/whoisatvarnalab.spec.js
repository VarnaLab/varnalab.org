var Whoisatvarnalab = require("../../plasma/whoisatvarnalab")
var Plasma = require("organic-plasma")

describe("whoisatvarnalab", function(){
  var plasma = new Plasma()
  var instance
  it("initializes", function(next){
    var dna = {
      emitReady: "ready",
      disabled: true
    }
    instance = new Whoisatvarnalab(plasma, dna)
    next()
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
