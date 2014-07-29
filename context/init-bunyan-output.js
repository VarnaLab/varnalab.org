var Bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

module.exports = function(plasma, dna){

  var prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);

  return Bunyan.createLogger({
    name: dna.bunyan.name,
    streams: [{
      level: 'debug',
      type: 'raw',
      stream: prettyStdOut
    }]
  })
}