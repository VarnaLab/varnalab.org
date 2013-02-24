var ExpressHttpActions = require("../../plasma/ExpressHttpActions");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("ExpressHttpActions", function(){
  
  var plasma = new Plasma();
  var config = {
    cwd: {
      "actions": "/tests/data/http-actions",
      "actionHelpers": "/tests/data/http-action-helpers"
    }
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

  var mockRes = {
    lastSend: null,
    lastError: null,
    send: function(body) {
      this.lastSend = body;
    }
  }

  var actions = new ExpressHttpActions(plasma, config);
  
  it("mounts actions to HttpServer properly", function(next){
    plasma.once("ExpressHttpActions", function(){
      expect(mockupApp.routes.all["*"]).toBeDefined();
      expect(mockupApp.routes.get["/"]).toBeDefined();
      expect(mockupApp.routes.post["/"]).toBeDefined();
      expect(mockupApp.routes.put["/"]).toBeDefined();
      expect(mockupApp.routes.del["/"]).toBeDefined();
      expect(mockupApp.routes.get["/returnTrue"]).toBeDefined();
      expect(mockupApp.routes.get["/inner"]).toBeDefined();
      expect(mockupApp.routes.get["/inner/route"]).toBeDefined();
      expect(mockupApp.routes.get["/:child"]).toBeDefined();
      next();
    });
    plasma.emit(new Chemical({
      type: "HttpServer",
      data: {
        app: mockupApp
      }
    }));
  });

  it("mounted actions are working", function(next){
    mockupApp.routes.get["/"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/"]({query:{testMiddleware: true}}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/returnTrue"]({}, mockRes);
    expect(mockRes.lastSend).toBe(true);
    mockupApp.routes.get["/testFalse"]({}, mockRes);
    expect(mockRes.lastSend).toBe(false);
    mockupApp.routes.get["/testError"]({}, mockRes);
    expect(mockRes.lastSend.result).toBe(true);
    next();
  })

});