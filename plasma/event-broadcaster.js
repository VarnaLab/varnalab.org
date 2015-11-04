var nodemailer = require('nodemailer')

module.exports = function (plasma, dna) {
  if (!dna.gmailAuth) return console.warn('gmail auth missing, wont broadcast events!!!')

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: dna.gmailAuth
  });

  plasma.on('broadcast/event', function (c) {
    var event = c.event
    var emailText = event.htmlContent()
    emailText += [
      '',
      '-------',
      '<a href="' + dna.fronturls.eventsPage + event.getUrl() + '">повече информация</a>',
      '',
      'Автоматично съобщение изпратено от varnalab.org'
    ].join('<br />')

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'varna.hack.lab@gmail.com', // sender address
      to: dna.targetEmail, // list of receivers
      subject: event.title + ', ' + event.startDate() + ' ' + event.startTime(), // Subject line
      html: emailText // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error) return console.log(JSON.stringify(error), info)
    });

  })
}
