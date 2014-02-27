require("shelljs/global");
if(exec("node ./node_modules/organic-angel/bin/angel cell upgrade ./dna/staging.json").code != 0){
  echo("Error: failed to upgrade staging");
  exit(1);
}
if(exec("node ./node_modules/organic-angel/bin/angel cell build ./dna/staging.json").code != 0){
  echo("Error: failed to build staging");
  exit(1);
}
if(exec("node ./node_modules/organic-angel/bin/angel cell restart ./dna/staging.json").code != 0){
  echo("Error: failed to restart staging");
  exit(1);
}