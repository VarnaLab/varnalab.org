describe("members", function(){
  var helpers = require("../helpers");
  var request = require("request");

  it("boots", function(next){
    helpers.boot(next);
  })

  var user={'username': 'asdasd', 'email':'asdasd@asd.as', 'password': 'asdasd'};
  it("registers new member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: user
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      user['id'] = body.result._id;
      expect(user['id']).toBe == body.result._id
      expect(body.result.username).toBeDefined();
      next();
    })
  })

  it("list all members", function(next){
    request.get({
      uri: helpers.apiendpoint+"/members",
      json: {}
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      next();
    })
  })

  it("login a member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/login",
      json: {'email':'asdasd@asd.as', 'password': 'asdasd'}
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.username).toBe = user.username
      next()
    })
  })

  it("stops", function(){
    helpers.kill();
  })
})