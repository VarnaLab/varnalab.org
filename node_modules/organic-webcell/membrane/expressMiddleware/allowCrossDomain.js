module.exports = function(config, httpServer){
  return function(res, req, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', config.allowOrigin || (req.headers?req.headers.origin:""));
    res.header('Access-Control-Allow-Methods', config.allowMethods || 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', config.allowHeaders || 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  }
}