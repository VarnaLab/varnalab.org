describe("members", function(){
  var helpers = require("../helpers");
  var request = require("request");

  var currentUserData;

  it("boots", function(next){
    helpers.boot(next);
  })

  var valid_user=helpers.getValidMember();

  it("registers new member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: valid_user
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      valid_user['id'] = body.result._id;
      expect(valid_user['id']).toBe == body.result._id
      next();
    })
  })

  it("does not register a member without email", function(next){
    var dummyUser = helpers.getValidMember();
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
    var dummyUser = helpers.getValidMember();
    dummyUser.email = helpers.getInvalidEmail();
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
      expect(body.result).toBeArray();
      next();
    })
  })

  it("login a member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/login",
      json: valid_user
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.email).toMatch(valid_user.email);
      currentUserData = body.result;
      next();
    })
  })

  it("show its own info", function(next){
    request.get({
      uri: helpers.apiendpoint+"/members/me",
      json: {}
    }, function(err, res, body){
      expect(err).toBeNull();
      expect(body.result).toBeDefined();
      expect(body.result._id).toBe(currentUserData._id);
      expect(body.result.email).toBe(currentUserData.email);
      expect(body.result.password).not.toBeDefined();
      next();
    })
  })

  it("show someone else info", function(next){
    helpers.createUser(function(user){
      expect(user._id).toBeDefined();
      request.get({
        uri: helpers.apiendpoint+"/members/"+user._id,
        json: {}
      }, function(err, res, body){
        expect(err).toBeNull();
        expect(body.result).toBeDefined();
        expect(body.result._id).toBe(user._id);
        expect(body.result.email).toBe(user.email);
        expect(body.result.password).not.toBeDefined();
        next();
      })
    })
  })

  it("does not login without email", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/login",
      json: {'password': valid_user.password}
    }, function(err, res, body){
      expect(err).toBeDefined();
      expect(body.result.message).toMatch('Missing credentials');
      next();
    })
  })

  it("logouts", function(next){
    request.get({
      uri: helpers.apiendpoint+"/members/logout",
      json: {}
    }, function(err, res, body){
      expect(err).toBeNull();
      expect(res.statusCode).toBe(200);
      next()
    })
  })

  it('kill', function (next){
    helpers.kill(next);
  });
})
