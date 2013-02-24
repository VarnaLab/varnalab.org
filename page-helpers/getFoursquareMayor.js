var url = "https://api.foursquare.com/v2/venues/4fc51305e4b027e26d42a6b0?oauth_token=1JNGSC00ZARNIIHWA0RD4VXTKSUE5RDGV0NOFU520BIXR2CP&v=20130216"
var request = require("request");
var mayor = null;

request.get(url, function(err, res, body){
  try {
    body = JSON.parse(body);
    var data = body.response.venue.mayor;
    mayor = data.user.firstName+" "+data.user.lastName;
  } catch(err) {
    console.error(err.stack);
  }
})

module.exports = function(req, res, next) {
  req.mayor = mayor;
  next();
}