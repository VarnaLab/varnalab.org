var fb = require('facebook-node')
fb.setApiVersion("v2.5")

var FB = function (dna) {
  this.dna = dna
}

FB.prototype.exec = function (event, user) {
  var dna = this.dna

  fb.api("/121769877975286/feed", "POST", {
    "link": dna.fronturls.eventsPage + event.getUrl(),
    "access_token": user.fbauth.access_token
  }, function (response) {
    console.info(response)
  })
}

module.exports = FB
