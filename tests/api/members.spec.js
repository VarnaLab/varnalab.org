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
      next();
    })
  })

  it("does not register a member without email", function(next){
    var dummyUser = user;
    dummyUser.email = null;
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: dummyUser
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.message).toMatch('Validation failed');
      next();
    })
  })

  it("does not register a member with wrong email", function(next){
    var dummyUser = user;
    dummyUser.email = helpers.shortText;
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: dummyUser
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.errors.email.type).toMatch('invalid email address');
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
      next()
    })
  })

  it("does not login without email", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/login",
      json: {'password': 'asdasd'}
    }, function(err, res, body){
      expect(err).toBeDefined();
      //TODO
      next();
    })
  })

  it("stops", function(){
    helpers.kill();
  })
})