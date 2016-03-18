var Maillist = require('./maillist')
var Fb = require('./fb')

module.exports = function (plasma, dna) {

  var maillist = null
  var fb = null

  if (!dna.gmailAuth) {
    console.warn('gmail auth missing, wont broadcast events to maillist!!!')
  } else {
    maillist = new Maillist(dna)
  }

  if (!dna.fbAuth) {
    console.warn('fb auth token missing, wont broadcast events to FB!!!')
  } else {
    fb = new Fb(dna)
  }

  plasma.on('broadcast/event', function (c) {
    /* invoked when event is created or updated */
    var event = c.event
    if (maillist) {
      //maillist.exec(event)
    }
    if (fb) {
      fb.exec(event)
    }
  })
}
