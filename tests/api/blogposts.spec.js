describe("blogposts", function() {
	var helpers = require('../helpers');
	var request = require('request');
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
					date : Date.now
				};
				next();
			});
			
		});
	});

	
	it("add new blogpost", function(next){
		blog = dummyBlogpost;
		request.post({
			uri: helpers.apiendpoint+"/blogposts/add",
			json: blog
		}, function(err, res, body){
			expect(body.result).toBeDefined();
			expect(body.result._id).toBeDefined();
			expect(body.result._id).toBe == dummyUser._id;
			next();
		});
	});

	it('list all blogposts', function(next) {
		request.get({
			uri: helpers.apiendpoint + "/blogposts",
			json: {}
		}, function(err, res, body){
			// console.log(body);
			expect(body.result).toBeDefined();
			expect(body.result).toBeArray();
			expect(body.result.length).toBe === 1;
			expect(body.result[0].title).toBe === blog.title;
			expect(body.result[0].content).toBe === blog.content;
			expect(body.result[0].date).toBe === blog.date;
			next();
		})
	});

	it('reject inserting blogpost without a valid member', function (next) {
		blog = dummyBlogpost;
		blog.member = null;

		request.post({
			uri:helpers.apiendpoint + '/blogposts/add',
			json: blog
		}, function (err, res, body) {
			console.log(err, body);
			next();
		});
	});
	
	it('kill', function (){ 
		helpers.kill();
	});
});