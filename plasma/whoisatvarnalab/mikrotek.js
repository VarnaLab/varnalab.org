var api = require('mikronode')
var _ = require("underscore")
var backoff = require('backoff')

module.exports = function(authOptions){
  this.authOptions = authOptions
  this.debug = false
  this.connected = false
  this.reconnecting = false
  this.fibonacciBackoff = backoff.fibonacci({
    randomisationFactor: 0,
    initialDelay: 100,
    maxDelay: 10*60000
  });
  this.fibonacciBackoff.failAfter(50);
}

module.exports.prototype.connect = function(done){
  var self = this
  if (self.debug) console.info('connecting to mikrotek')
  this.connection = new api(this.authOptions.host, this.authOptions.user, this.authOptions.pass, {port: this.authOptions.port})
  this.connection.connect(function(conn) {
    self.chan = conn.openChannel()
    self.connected = true
    if (self.debug) console.info('connected OK')
    done && done()
  })
  this.connection.on('error', function(err){
    console.error('mikrotek error', err)
    if(!self.connected) done && done(err)
    if (self.debug) console.info('connecting to mikrotek FAILED')
    self.close()
  })
}

module.exports.prototype.reconnect = function() {
  var self = this
  if (self.debug) console.info('reconnecting to mikrotek')
  this.reconnecting = true

  this.fibonacciBackoff.on('ready', function(number, delay) {
    self.connect(function(err){
      if (err) return self.fibonacciBackoff.backoff()
      self.fibonacciBackoff.reset()
      self.reconnecting = false
    })
  });

  this.fibonacciBackoff.on('fail', function() {
    console.error('fail to reconnect 50 times to mikrotek');
  });

  this.fibonacciBackoff.backoff();
}

module.exports.prototype.close = function(done){
  var self = this
  self.connected = false
  if (self.connection)
    self.connection.close()
  if (self.chan)
    self.chan.close()
  if (self.fibonacciBackoff)
    self.fibonacciBackoff.reset()
  done && done()
}

module.exports.prototype.fetchDHCPClientsPopulated = function(done){
  var self = this

  // do not trigger reconnect if already in process
  if(self.reconnecting) return done([])

  // if not connected trigger reconnect
  if(!self.connected) {
    self.reconnect()
    return done([])
  }

  // everything fine, we're connected
  this.fetchLeasedDHCPClients(function(leasedClients){
    self.fetchActiveDHCPClients(function(activeClients){
      activeClients = activeClients.map(function(activeClient){
        var leasedClient = _.findWhere(leasedClients, {"mac-address": activeClient["mac-address"]})
        return _.extend(activeClient, leasedClient)
      })
      done(activeClients)
    })
  })
}

module.exports.prototype.fetchActiveDHCPClients = function(done){
  var self = this
  if(!self.chan) return done([])
  self.chan.write('/ip/arp/getall',function() {
     self.chan.on('error', function(err){
       console.error('failed to fetchActiveDHCPClients', err)
     })
     self.chan.on('done',function(data) {
        var parsed = api.parseItems(data);
        done(parsed)
     });
  });
}

module.exports.prototype.fetchLeasedDHCPClients = function(done){
  var self = this
  if(!self.chan) return done([])
  self.chan.write('/ip/dhcp-server/lease/getall',function() {
    self.chan.on('error', function(err){
      console.error('failed to fetchLeasedDHCPClients', err)
    })
     self.chan.on('done',function(data) {
        var parsed = api.parseItems(data);
        done(parsed)
     });
  });
}
