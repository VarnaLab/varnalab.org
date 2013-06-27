describe("events", function(){
  var helpers = require("../helpers");
  var request = require("request");

  it("boots", function(next){
    helpers.boot(next);
  })

  var member = helpers.getValidMember();
  var event = helpers.getValidEvent();
  
  it("registers new member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: member
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      member['id'] = body.result._id;
      expect(member['id']).toBe == body.result._id;
      next();
    })
  })

  it("creates new event", function(next){

    request.post({
      uri: helpers.apiendpoint+"/events/create",
      json: event
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      event['id'] = body.result._id;
      next();
    })
  })

  it("does not create an event with invalid date", function(next){
    var event = helpers.getValidEvent();
    event.startDateTime = {};
    request.post({
      uri: helpers.apiendpoint+"/events/create",
      json: event
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.message).toMatch('Validation failed');
      next();
    })
  })

  it("lists all events", function(next){
    request.get({
      uri: helpers.apiendpoint+"/events",
      json: {}
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result).toBeArray();
      next();
    })
  })

  it("updates an event", function(next){
    var up_event = event;
    up_event.title = 'Happy BirthDay, Varnalab!';
    request.put({
      uri: helpers.apiendpoint+"/events/"+up_event.id,
      json: up_event
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.title).toMatch('Happy BirthDay, Varnalab!');
      next();
    })
  })

  it("does not update without title", function(next){
    var up_event = event;
    up_event.title = '';
    request.put({
      uri: helpers.apiendpoint+"/events/"+up_event.id,
      json: up_event
    }, function(err, res, body){
      expect(err).toBeDefined();
      expect(body.result.message).toMatch('Validation failed');
      next();
    })
  })

  it("removes an event", function(next){
    request.del({
      uri: helpers.apiendpoint+"/events/remove",
      json: event
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      request.get({
        uri: helpers.apiendpoint+"/events",
        json: {}
      }, function(err, res, body){
        expect(body.result).toBeDefined();
        expect(body.result).toMatch([]);
        next();
      });
    })
  })

  it("stops", function(){
    helpers.kill();
  })
})