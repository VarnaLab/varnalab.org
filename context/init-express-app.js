var express = require("express")
var bodyParser = require("body-parser")
var path = require("path")
var CookieParser = require('cookie-parser');
var jade = require("jade")
var errorface = require('errorface')
var Grant = require('grant')

var provide_get_handler = function(settings){

  for (var provider in settings) {
    settings[provider][provider] = true;
    settings[provider].name = provider;

    settings[provider].get = function (app, config) {
      var s = this;
      // app
      if (s.auth_version == 1) {
        s.consumer_key = app.key;
        s.consumer_secret = app.secret;
      }
      else if (s.auth_version == 2) {
        s.client_id = app.key;
        s.client_secret = app.secret;
      }

      // 
      s.headers = config.headers||null; // custom headers
      s.redirect = config.redirect||null; // full path callback url
      s.scope = config.scope||null;
      s.callback = config.callback||'';
      
      if (s.linkedin) {
        // LinkedIn accepts an extended "scope" parameter when obtaining a request.
        // Unfortunately, it wants this as a URL query parameter, rather than encoded
        // in the POST body (which is the more established and supported mechanism of
        // extending OAuth).
        s.request_url += '?scope='+s.scope;
      }

      return s;
    }
  }
}

var app_handler = function(oauth, credentials, options){
  return function (provider) {
    return oauth[provider].get(credentials[provider], options[provider])
  }
} 

module.exports = function(plasma, dna, next) {
  var app = express();

  app.set("views", path.join(process.cwd(), dna.views))
  app.set("view engine", "jade")
  app.set("x-powered-by", false)

  app.engine('jade', jade.__express);
  app.use(bodyParser());

  var cookieParser = CookieParser(dna.cookie_secret);
  app.use(cookieParser);
  

  plasma.on(dna.expressSetupDoneOnce, function(){
    // initialize grant!
    if(dna.grant) {
      provide_get_handler(dna.grant.oauth)

      app.use(new Grant({
        server: dna.grant.server,
        credentials: dna.grant.credentials,
        oauth: dna.grant.oauth,
        app: app_handler(dna.grant.oauth, dna.grant.credentials, dna.grant.options)
      }))
    } else
      console.warn("grant not initialized, mass sharing won't work!")

    app.all("*", function(req, res, next){
      res.send(404, "not found")
    })
    app.use(errorface.errorHandler())
  })
  if(!dna.reactOn)
    next(null, app)
  else
    plasma.on(dna.reactOn, function(){
      next(null, app)
    })
}