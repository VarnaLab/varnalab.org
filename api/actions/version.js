module.exports = function(){
  var version = require(process.cwd()+"/package.json").version;
  return {
    "GET": function(req, res){
      res.result(version);
    }
  }
}