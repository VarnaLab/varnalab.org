require("shelljs/global");
if(exec("node ./node_modules/organic-angel/bin/angel cell upgrade ./dna/staging").code != 0){
  echo("Error: failed to upgrade staging");
  exit(1);
}