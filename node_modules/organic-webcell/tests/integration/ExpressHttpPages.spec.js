var ExpressHttpPages = require("../../plasma/ExpressHttpPages");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("ExpressHttpPages", function(){
  
  var plasma = new Plasma();
  var config = {
    cwd: {
      "pages": "/tests/data/http-pages",
      "pageHelpers": "/tests/data/http-page-helpers"
    },
    debug: true
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
    c.data = true;
    callback(c);
  });
  plasma.on("BundleStyle", function(c, sender, callback){
    c.data = true;
    callback(c);
  });

  var mockRes = {
    lastSend: null,
    lastError: null,
    send: function(body) {
      this.lastSend = body;
    },
    setHeader: function(){}
  }

  var pages = new ExpressHttpPages(plasma, config);
  
  it("mounts pages to HttpServer properly", function(next){
    plasma.once("ExpressHttpPages", function(){
      expect(mockupApp.routes.all["*"]).toBeDefined();
      expect(mockupApp.routes.get["/"]).toBeDefined();
      expect(mockupApp.routes.post["/"]).toBeDefined();
      expect(mockupApp.routes.put["/"]).toBeDefined();
      expect(mockupApp.routes.del["/"]).toBeDefined();
      expect(mockupApp.routes.get["/testPage1"]).toBeDefined();
      expect(mockupApp.routes.get["/testPage2"]).toBeDefined();
      expect(mockupApp.routes.get["/:child/testPage3"]).toBeDefined();
      expect(mockupApp.routes.get["/:child/testPage4"]).toBeDefined();
      expect(mockupApp.routes.get["/:child"]).toBeDefined();
      expect(mockupApp.routes.get["/code.js"]).toBeDefined();
      expect(mockupApp.routes.get["/:child/testPage4/code.js"]).toBeDefined();
      expect(mockupApp.routes.get["/testPage1/style.css"]).toBeDefined();
      next();
    });
    plasma.emit(new Chemical({
      type: "HttpServer",
      data: {
        app: mockupApp
      }
    }));
  });

  it("mounted pages are working", function(next){
    mockupApp.routes.get["/"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/"]({query:{testMiddleware: true}}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/testPage1"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/testPage2"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/:child"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/code.js"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/:child/testPage4/code.js"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/testPage1/style.css"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    next();
  })

});