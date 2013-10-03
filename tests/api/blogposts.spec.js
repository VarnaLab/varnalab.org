describe("blogposts", function() {
  var helpers = require('../helpers');
  var request = require('request');
  var _ = require('underscore');
  var dummyUser;
  // fixture object that is used all over the test
  var dummyBlogpost;
  // first created blog post, used in update & delete tests
  var createdBlogPost;

  it('boots', function(next) {
    helpers.boot(function() {
      dummyBlogpost = {
        title : helpers.shortText,
        content : helpers.longText,
        date : Date.now()
      };
      next();
    });
  });

  it('rejects inserting a blogpost without a valid member', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.creator = null;

    request.post({
      uri:helpers.apiendpoint + "/blogposts/add",
      json: blog
    }, function (err, res, body) {
      expect(body.result.message).toBe('Validation failed');
      next();
    });
  });

  it('rejects inserting a blogpost with an invalid member', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.creator = "test";

    request.post({
      uri:helpers.apiendpoint + "/blogposts/add",
      json: blog
    }, function (err, res, body) {
      expect(body.result.message).toContain('Cast to ObjectId failed');
      next();
    });
  });

  it("registers user", function(next){
    helpers.createUser(function(userData) {
      dummyUser = userData;
      next()
    })
  })

  
  it("adds new blogpost", function(next){
    var blog = _.clone(dummyBlogpost);
    request.post({
      uri: helpers.apiendpoint+"/blogposts/add",
      json: blog
    }, function(err, res, body){
      expect(body.result).toBeDefined();
      expect(body.result._id).toBeDefined();
      createdBlogPost = body.result;
      next();
    });
  });

  it('lists all blogposts', function(next) {
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

  it('rejects inserting a blogpost without a valid content', function (next) {
    var blog = _.clone(dummyBlogpost);
    blog.content = null;
    blog.date = new Date()
    blog.date.setFullYear(2000)

    request.post({
      uri : helpers.apiendpoint + "/blogposts/add",
      json : blog
    }, function (err, res, body) {
      expect(body.result).toBeDefined();
      expect(body.result.errors).toBeDefined();
      expect(body.result.message).toBe('Validation failed');
      expect(body.result.errors.content.message).toContain('Validator "required" failed');
      next();
    });
  });

  it('rejects inserting a blogpost with same slug name', function (next) {
    var blog = _.clone(dummyBlogpost);

    request.post({
      uri : helpers.apiendpoint + "/blogposts/add",
      json : blog
    }, function (err, res, body) {
      expect(body.result).toBeDefined();
      expect(body.result).toBe("blog post with same slug name exists already for given date");
      next();
    });
  });

  it('updates blog post', function(next){
    request.put({
      uri: helpers.apiendpoint+"/blogposts/"+createdBlogPost._id,
      json: {
        title: "updated blog"
      }
    }, function(err, res, body){
      expect(body.result.title).toBe("updated blog");
      next();
    })
  })

  it('removes blog post', function(next){
    request.del({
      uri: helpers.apiendpoint+"/blogposts/"+createdBlogPost._id,
      json: {}
    }, function(err, res, body){
      expect(body.result.title).toBe("updated blog");

      // check again is the blog post present in listing
      request.get({
        uri: helpers.apiendpoint + "/blogposts",
        json: {}
      }, function(err, res, body){
        expect(body.result.length).toBe(0);
        next();
      });
    })
  })

  it('kill', function (next){ 
    helpers.kill(next);
  });
});