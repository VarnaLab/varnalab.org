describe("events", function(){
  var helpers = require("../helpers");
  var request = require("request");

  var createdEvent;

  it("boots", function(next){
    helpers.boot(next);
  })
  
  it("registers new member", function(next){
    request.post({
      uri: helpers.apiendpoint+"/members/register",
      json: helpers.getValidMember()
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      next();
    })
  })

  it("creates new event", function(next){
    request.post({
      uri: helpers.apiendpoint+"/events/add",
      json: helpers.getValidEvent()
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      createdEvent = body.result;
      next();
    })
  })

  it("does not create an event with invalid date", function(next){
    var event = helpers.getValidEvent();
    event.startDateTime = {};
    request.post({
      uri: helpers.apiendpoint+"/events/add",
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
      expect(body.result.length).toBe(1);
      expect(body.result[0]._id).toBe(createdEvent._id)
      next();
    })
  })

  it("updates an event", function(next){
    request.put({
      uri: helpers.apiendpoint+"/events/"+createdEvent._id,
      json: {
        title : 'Happy BirthDay, Varnalab!'
      }
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result.title).toMatch('Happy BirthDay, Varnalab!');
      next();
    })
  })

  it("does not update without title", function(next){
    request.put({
      uri: helpers.apiendpoint+"/events/"+createdEvent._id,
      json: {
        title: ""
      }
    }, function(err, res, body){
      expect(err).toBeDefined();
      expect(body.result.message).toMatch('Validation failed');
      next();
    })
  })

  it("removes an event", function(next){
    request.del({
      uri: helpers.apiendpoint+"/events/"+createdEvent._id,
      json: {}
    }, function(err, res, body){
      request.get({
        uri: helpers.apiendpoint+"/events",
        json: {}
      }, function(err, res, body){
        expect(body.result).toBeDefined();
        expect(body.result.length).toBe(0);
        next();
      });
    })
  })

  it('kill', function (next){ 
    helpers.kill(next);
  });
})