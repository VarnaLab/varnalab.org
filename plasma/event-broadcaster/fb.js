var fb = require('facebook-node')

var FB = function (dna) {
  this.dna = dna
  fb.setAccessToken(dna.fbAuth.token)
}

FB.prototype.exec = function (event) {
  var dna = this.dna

  var notificationText = ''
  notificationText += [
    event.title + ', ' + event.startDate() + ' ' + event.startTime(),
    '',
    '-------',
    '<a href="' + dna.fronturls.eventsPage + event.getUrl() + '">повече информация</a>',
    '',
    'Автоматично съобщение изпратено от varnalab.org'
  ].join('\n')

  fb.api("/121769877975286/feed", "POST", {
    "message": notificationText
  }, function (response) {
    console.info(response)
  })
}

module.exports = FB
