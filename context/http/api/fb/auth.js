var request = require('request')

module.exports = function (plasma, dna, helpers) {
  return {
    "* *": helpers.allowLogged,
    "GET": function (req, res, next) {
      var redirect_uri = "redirect_uri="+dna.fronturls.endpoint+"/api/fb/auth/callback"
      var client_id = "client_id="+dna.fbAuth.client_id
      var scope = "scope=user_managed_groups,publish_actions"
      var uri = "https://www.facebook.com/dialog/oauth?" + [client_id, redirect_uri, scope].join('&')
      res.redirect(uri)
    },
    "GET /callback": function (req, res, next) {
      var code = "code=" + req.query.code
      var client_id = "client_id="+dna.fbAuth.client_id
      var redirect_uri = "redirect_uri="+dna.fronturls.endpoint+"/api/fb/auth/callback"
      var client_secret = "client_secret="+dna.fbAuth.client_secret
      var uri = "https://graph.facebook.com/v2.5/oauth/access_token?" + [code, redirect_uri, client_id, client_secret].join("&")
      request.get({
        uri: uri,
        json: {}
      }, function (err, r, body) {
        if (err) return res.error(err.message)
        if (!body.access_token) return res.error('access_token not found')
        req.user.fbauth.access_token = body.access_token
        req.user.fbauth.expires_in = body.expires_in
        req.user.fbauth.generated = new Date()
        req.user.save(function (err) {
          if (err) return res.error(err.message)
          res.redirect('/admin#')
        })
      })
    }
  }
}
