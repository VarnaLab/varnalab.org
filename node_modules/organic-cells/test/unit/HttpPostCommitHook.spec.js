var organic = require("organic");
var path = require('path');

describe("Self", function(){
  var PostCommitHook = require("../../plasma/HttpPostCommitHook");
  var plasma = new organic.Plasma();
  var handler;

  it("creates instance", function(next) {
    instance = new PostCommitHook(plasma);
    expect(instance instanceof PostCommitHook).toBe(true);
    next();
  });

  it("handles post-commit chemical", function(next){
    plasma.once("Self", function(c, sender, callback){
      expect(sender instanceof PostCommitHook).toBe(true);
      expect(c.action).toBe("upgrade");
      callback(c);
    });
    plasma.emit({
      type: "HttpPostCommitHook",
      action: "processPostCommit"
    }, this, function(c){
      expect(c instanceof Error).toBe(false);
      next();
    });
  })

  it("registers to HttpServer", function(next){
    var url;
    plasma.emit({
      type: "HttpServer",
      data: {
        app: {
          post: function(_url, _handler) {
            url = _url;
            handler = _handler;
          }
        }
      }
    });

    expect(url).toBe("/post-commit");
    next();
  })

  it("handles github payload", function(next){
    instance.config.triggerOn = "master";
    plasma.once("Self", function(c, sender, callback){
      expect(sender instanceof PostCommitHook).toBe(true);
      expect(c.action).toBe("upgrade");
      next();
    });
    handler({
      body: require("../data/github-payload.json")
    }, {
      send: function(){
        
      }
    })
  })

  it("dont handles github payload", function(next){
    instance.config.triggerOn = "develop";
    plasma.once("Self", function(c, sender, callback){
      throw new Error("shouldnt happen");
    });
    handler({
      body: require("../data/github-payload.json")
    }, {
      send: function(){
        next();
      }
    })
  })

});