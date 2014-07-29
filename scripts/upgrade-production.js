require("shelljs/global");
if(exec("node ./node_modules/organic-angel/bin/angel cell upgrade ./dna/_production/cell.json").code != 0){
  echo("Error: failed to upgrade production");
  exit(1);
}