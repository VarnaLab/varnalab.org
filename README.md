varnalab.org
===

# install
1. install [nodejs](http://nodejs.org) or use [nvm](https://github.com/creationix/nvm)
2. git clone git@github.com:VarnaLab/varnalab.org.git
3. cd varnalab.org && npm install
4. node varnalab.org.js

# scripts

Every .js in /scripts folder can be executed via node, example

    $ node scripts/import-blogposts


## import old blogposts from blogger

    $ node scripts/import-blogposts

## release develop to master

    $ node scripts/release.js

## release to staging

    $ node scripts/release-staging.js

## prebuild all js/css assets

    $ CELL_MODE=staging node scripts/prebuild-assets.js