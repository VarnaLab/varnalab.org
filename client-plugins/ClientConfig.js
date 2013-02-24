module.exports = function(){
  return function(bundle){

    var clientEnv = require(__dirname+"/../client/config/"+process.env.CELL_MODE+".json");
    bundle.include(null, "config", "module.exports = "+JSON.stringify(clientEnv)+";");

    bundle.register(".jade.html", function(body, file){
      var compiled = jade.compile(body, {
        filename: file
      })();
      var escaped = "module.exports = '"+compiled.replace(/[\']/g, "\\'").replace(/[\r]/g, "").replace(/[\n]/g, "\\n")+"';";
      return escaped;
    });

    bundle.register(".jade", function(body, file){
      return "module.exports = '"+body.replace(/[\']/g, "\\'").replace(/[\r]/g, "").replace(/[\n]/g, "\\n")+"';";
    });

    bundle.register(".raw", function(body, file){
      return "module.exports = '"+body.replace(/[\']/g, "\\'").replace(/[\r]/g, "").replace(/[\n]/g, "\\n")+"';";
    });
  }
}