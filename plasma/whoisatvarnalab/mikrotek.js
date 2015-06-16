var api = require('mikronode')
var _ = require("underscore")

module.exports = function(authOptions){
  this.authOptions = authOptions
  this.debug = true
}

module.exports.prototype.connect = function(done){
  var self = this
  this.connection = new api(this.authOptions.host, this.authOptions.user, this.authOptions.pass, {port: this.authOptions.port})
  this.connection.connect(function(conn) {
    self.chan = conn.openChannel()
    done && done()
  })
}

module.exports.prototype.close = function(done){
  var self = this
  self.connection.close()
  self.chan.close()
  done && done()
}

module.exports.prototype.fetchDHCPClientsPopulated = function(done){
  var self = this
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
     self.chan.on('done',function(data) {
        var parsed = api.parseItems(data);
        done(parsed)
     });
  });
}