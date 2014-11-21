varnalab.org
===

# install
1. install [nodejs](http://nodejs.org) or use [nvm](https://github.com/creationix/nvm)
2. git clone git@github.com:VarnaLab/varnalab.org.git
3. cd varnalab.org && npm install
4. node varnalab.org.js
5. goto [http://localhost:8080](http://localhost:8080/)

# scripts

Every .js in /scripts folder can be executed via node, example

    $ node scripts/import-blogposts

## import old blogposts from blogger

    $ node scripts/import-blogposts

## release `develop` to `master` branch

    $ npm release

## release to staging

    $ node scripts/upgrade-staging.js

## release to production

    $ node scripts/upgrade-production.js

## prebuild all js/css assets

    $ CELL_MODE=staging node scripts/prebuild-assets.js

## change default launch port 
    $ PORT=1337 node varnalab.org