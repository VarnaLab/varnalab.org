describe("blogposts", function() {
  var helpers = require('../helpers');
  var request = require('request');
  var _ = require('underscore');
  var dummyUser;
  // fixture object that is used all over the test
  var dummyBlogpost;

  it('boots', function(next) {
    helpers.boot(function() {
      helpers.createUser(function(userData) {
        dummyUser = userData;
        dummyBlogpost = {
          title : helpers.shortText,
          member : dummyUser._id,
          content : helpers.longText,
          date : Date.now()
        };
        next();
      });
      
    });
  });

  
  it("add new blogpost", function(next){
    var blog = _.clone(dummyBlogpost);
    request.post({
      uri: helpers.apiendpoint+"/blogposts/add",
      json: blog
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      next();
    });
  });

  it('list all blogposts', function(next) {
    request.get({
      uri: helpers.apiendpoint + "/blogposts",
      json: {}
    }, function(err, res, body){
      var blogDate = new Date(dummyBlogpost.date).getTime(),
      resultBlogDate = new Date(body.result[0].date).getTime();

      expect(body.result).toBeDefined();
      expect(body.result).toBeArray();
      expect(body.result.length).toBe(1);
      expect(body.result[0].title).toBe(dummyBlogpost.title);
      expect(body.result[0].content).toBe(dummyBlogpost.content);
      expect(resultBlogDate).toBe(blogDate);
      next();
    })
  });

  it('reject inserting blogpost without a valid member', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.member = null;

    request.post({
      uri:helpers.apiendpoint + "/blogposts/add",
      json: blog
    }, function (err, res, body) {

      expect(body.result.errors).toBeDefined();
      expect(body.result.message).toBe('Validation failed');
      expect(body.result.errors.member.message).toBe('Invalid member id provided');
      next();
    });
  });

  it('reject inserting blogpost with an invalid member', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.member = "test";

    request.post({
      uri:helpers.apiendpoint + "/blogposts/add",
      json: blog
    }, function (err, res, body) {

      expect(body.result.errors).toBeDefined();
      expect(body.result.message).toBe('Validation failed');
      expect(body.result.errors.member.message).toBe('Invalid member id provided');
      next();
    });
  });

  it('reject inserting blogpost without a valid content', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.content = null;

    request.post({
      uri : helpers.apiendpoint + "/blogposts/add",
      json : blog
    }, function (err, res, body) {
      // console.log(body.result);
      expect(body.result).toBeDefined();
      expect(body.result.errors).toBeDefined();
      expect(body.result.message).toBe('Validation failed');
      expect(body.result.errors.content.message).toBe('Validator "required" failed for path content');
      next();
    });
  });

  it('reject inserting blogpost without a valid date', function(next) {
    var blog = _.clone(dummyBlogpost);
    blog.date = null;

    request.post({
      uri : helpers.apiendpoint + "/blogposts/add",
      json : blog
    }, function(err, res, body) {
      expect(body.result).toBeDefined();
      expect(body.result.errors).toBeDefined();
      expect(body.result.message).toBe('Validation failed');
      expect(body.result.errors.date.message).toBe('Validator "required" failed for path date');
      next();
    });
  });

  it('kill', function (){ 
    helpers.kill();
  });
});