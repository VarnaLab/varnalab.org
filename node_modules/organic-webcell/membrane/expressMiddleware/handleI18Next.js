var _ = require("underscore");

module.exports = function(config, httpServer){

  // setup i18n support
  var i18next = require('i18next');
  var target = config.localesDir;
  if(target.indexOf("/") !== 0)
    target = process.cwd()+"/"+target;

  i18next.init(_.extend({
    fallbackLng: 'dev',
    saveMissing: true,
    resGetPath: target+'/__lng__/__ns__.json',
    resSetPath: target+'/__lng__/__ns__.json'
  }, config));

  i18next.init(_.extend({
    ns: { namespaces: ['translation'], defaultNs: 'translation'},
    fallbackLng: 'dev',
    saveMissing: true,
    resGetPath: target+'/__lng__/__ns__.json',
    resSetPath: target+'/__lng__/__ns__.json'
  }, config));

  // checks current language settings: cookie, header, querystring ?setLng=bg
  httpServer.app.use(i18next.handle);

  i18next.serveDynamicResources(httpServer.app)    // route which returns all resources in on response
         .serveMissingKeyRoute(httpServer.app)     // route to send missing keys
         .serveChangeKeyRoute(httpServer.app);     // route to post value changes
}