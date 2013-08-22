describe("site", function(){
  var helpers = require("../helpers");
  var request = require("request");

  it("boots", function(next){
    helpers.boot(next);
  })

  it("api returns version", function(next){
    request.get({
      uri: helpers.apiendpoint+"/version",
      json: {}
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      next();
    })
  })

  it('kill', function (next){ 
    helpers.kill(next);
  });
})