require("shelljs/global");
if(exec("node ./node_modules/organic-angel/bin/angel git-release develop to origin at master").code != 0){
  echo("Error: failed to upgrade staging");
  exit(1);
}