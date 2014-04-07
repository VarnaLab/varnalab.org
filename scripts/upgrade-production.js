require("shelljs/global");
if(exec("node ./node_modules/organic-angel/bin/angel cell upgrade ./dna/production/cell.json").code != 0){
  echo("Error: failed to upgrade production");
  exit(1);
}
if(exec("node ./node_modules/organic-angel/bin/angel cell build ./dna/production/cell.json").code != 0){
  echo("Error: failed to build production");
  exit(1);
}
if(exec("node ./node_modules/organic-angel/bin/angel cell restart ./dna/production/cell.json").code != 0){
  echo("Error: failed to restart production");
  exit(1);
}