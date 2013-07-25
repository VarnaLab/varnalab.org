require("shelljs/global");
require('./release');

if(exec("angel Cell upgrade staging").code != 0){
  echo("Error: failed to upgrade staging");
  exit(1);
}