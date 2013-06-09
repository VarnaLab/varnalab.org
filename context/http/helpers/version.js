var fs = require("fs");

var version = JSON.parse(fs.readFileSync(process.cwd()+"/package.json")).version;

module.exports = function(req, res, next){
  req.version = version;
  next();
}