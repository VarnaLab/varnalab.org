var ExpressHttpPages = require("../../plasma/ExpressHttpPages");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("ExpressHttpPages", function(){
  var bundleCodeInvoked = false;
  var bundleStyleInvoked = false;

  var plasma = new Plasma();
  var config = {
    cwd: {
      "pages": "/tests/data/http-pages",
      "pageHelpers": "/tests/data/http-page-helpers"
    },
    debug: true,
    prebuildAssets: true
  };
  var mockupApp = {
    routes: {get:{}, put:{}, post:{}, del: {}, all: {}},
    get: function(url, action){
      this.routes.get[url] = action;
    },
    put: function(url, action){
      this.routes.put[url] = action;
    },
    post: function(url, action){
      this.routes.post[url] = action;
    },
    del: function(url, action){
      this.routes.del[url] = action;
    },
    all: function(url, action){
      this.routes.all[url] = action;
    }
  }

  plasma.on("RenderPage", function(c, sender, callback){
    c.data = true;
    callback(c);
  })
  plasma.on("BundleCode", function(c, sender, callback){
    bundleCodeInvoked = true;
    c.data = true;
    setTimeout(function(){
      callback(c);
    }, 1000);
  });
  plasma.on("BundleStyle", function(c, sender, callback){
    bundleStyleInvoked = true;
    c.data = true;
    setTimeout(function(){
      callback(c);
    }, 1000);
  });

  var mockRes = {
    lastSend: null,
    lastError: null,
    send: function(body) {
      this.lastSend = body;
    },
    setHeader: function(){}
  }
  
  it("mounts assets to HttpServer properly", function(next){
    bundleCodeInvoked = false;
    bundleStyleInvoked = false;
    var pages = new ExpressHttpPages(plasma, config);
    plasma.once("ExpressHttpPages", function(){
      setTimeout(function(){
        expect(bundleStyleInvoked).toBe(true);
        expect(bundleCodeInvoked).toBe(true);
        next();
      }, 2000)
      
    });
    plasma.emit(new Chemical({
      type: "HttpServer",
      data: {
        app: mockupApp
      }
    }));
  });
});