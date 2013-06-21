var organic = require("organic");
var dna = new organic.DNA();
var shelljs = require("shelljs");

module.exports.exec = function(next) {
  dna.loadFile(process.cwd()+'/dna/'+process.env.CELL_MODE+'/prebuild.json', function(){
    var cell = new organic.Cell(dna);
    var waitForComplete = 2;
    cell.plasma.on("StoreBundlesDone", function(c){
      if(c instanceof Error) throw c;
      waitForComplete -= 1;
      if(waitForComplete == 0)
        if(next) next();
    })
    shelljs.rm("-rf",process.cwd()+"/"+dna.plasma.FindCodeBundles.target.assetsStore);
    shelljs.rm("-rf",process.cwd()+"/"+dna.plasma.FindStyleBundles.target.assetsStore);
    cell.plasma.emit({ type: "StoreCodeBundles", data: {} });
    cell.plasma.emit({ type: "StoreStyleBundles", data: {} });
  })
}

if(!module.parent)
  module.exports.exec();