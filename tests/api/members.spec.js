describe("members", function(){
  var helpers = require("../helpers");
  var request = require("request");

  it("boots", function(next){
    helpers.boot(next);
  })

  it("registers new member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members",
      json: {'username': 'asdasd', 'email':'asdasd@asd.as', 'password': 'asdasd'}
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.username).toBeDefined();
      next();
    })
  })

  it("stops", function(){
    helpers.kill();
  })
})