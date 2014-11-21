var request = require("request");

module.exports = function(plasma, dna) {
  var url = "https://api.foursquare.com/v2/venues/4fc51305e4b027e26d42a6b0?oauth_token=1JNGSC00ZARNIIHWA0RD4VXTKSUE5RDGV0NOFU520BIXR2CP&v=20130216"
  var mayor = null;

  var fetchData = function(){
    request.get(url, function(err, res, body){
      try {
        body = JSON.parse(body);
        var data = body.response.venue.mayor;
        // resolve missing mayour user object 
        // -> https://developer.foursquare.com/docs/responses/venue
        if(data.user)
          mayor = data.user.firstName+" "+data.user.lastName;
        else
          mayor = "nobody"
      } catch(err) {
        console.error(err.stack);
      }
    })
  }

  var fetchIntervalID = setInterval(fetchData, 60*1000);
  fetchData();

  plasma.on("foursquaremajor", function(c, done){
    done(null, mayor)
  })
  plasma.on("kill", function(){
    if(fetchIntervalID) {
      clearInterval(fetchIntervalID)
      fetchIntervalID = null
    }
  })
}