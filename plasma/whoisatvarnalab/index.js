var _ = require("underscore")
var moment = require("moment")
moment.lang("bg")

var Mikrotek = require("./mikrotek")

var Person = module.exports.Person = function(data){
  this.host = data["host-name"];
  this.mac = data["mac-address"];
  this.ip = data["address"];
}

module.exports = function(plasma, dna){
  
  this.updateInProgress = false
  this.peopleOnline = []
  this.lastFetchTimestamp = new Date()
  
  plasma.on("whoisatvarnalab", this.whoisatvarnalab, this)
  plasma.on("kill", this.kill, this)
  
  if(dna.auth && dna.auth.host) {
    var self = this
    this.dhcpRouter = new Mikrotek(dna.auth)
    this.dhcpRouter.connect(function(){
      self.update({}, function(){
        if(dna.emitReady)
          plasma.emit({type: dna.emitReady})
      })
    })
    
    this.poolIntervalID = setInterval(function(){
      self.update()
    }, dna.interval || 5*60*1000)
  } else
    console.info("whoisatvarnalab missing auth options")
}

module.exports.prototype.update = function(c, next) {
  if(this.updateInProgress)
    return next && next()
  var self = this
  this.updateInProgress = true
  this.dhcpRouter.fetchDHCPClientsPopulated(function(items){
    self.updateInProgress = false
    self.lastFetchTimestamp = new Date()
    
    self.peopleOnline = items.map(function(data){
      return new Person(data)
    })
    next && next()
  })
}

module.exports.prototype.whoisatvarnalab = function(c, next){
  var self = this
  next(null, {
    data: self.peopleOnline,
    timestamp: moment(self.lastFetchTimestamp).fromNow()
  })
}

module.exports.prototype.kill = function(c, next) {
  if(this.poolIntervalID)
    clearInterval(this.poolIntervalID)
    
  if(this.dhcpRouter)
    this.dhcpRouter.close(next)
  else
    next()
}