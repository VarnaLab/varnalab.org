var request = require('request')

module.exports = function (plasma, dna, helpers) {
  return {
    "GET": function (req, res, next) {
      var redirect_uri = "redirect_uri=http://localhost:8080/api/fb/auth/callback"
      var client_id = "client_id=601608396658686"
      var scope = "scope=user_managed_groups,publish_actions"
      var uri = "https://www.facebook.com/dialog/oauth?" + [client_id, redirect_uri, scope].join('&')
      res.redirect(uri)
    },
    "GET /callback": function (req, res, next) {
      var code = "code=" + req.query.code
      var client_id = "client_id=601608396658686"
      var redirect_uri = "redirect_uri=http://localhost:8080/api/fb/auth/callback"
      var client_secret = "client_secret=3f1106df3d4e545ac8529eb84d7717a8"
      var uri = "https://graph.facebook.com/v2.5/oauth/access_token?" + [code, redirect_uri, client_id, client_secret].join("&")
      request.get({
        uri: uri,
        json: {}
      }, function (err, r, body) {
        console.log(body, body.access_token)
        res.redirect('/admin?fb_success=true#')
      })
    }
  }
}
