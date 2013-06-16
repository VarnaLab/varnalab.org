describe("blogposts", function() {
	var helpers = require('../helpers');
	var request = require('request');

	it('boots', function(next) {
		helpers.boot(next);
	});

	// fixture object that is used all over the test
	var dummyBlogpost = {
		title : helpers.shortText,
		memberId : '51bb2b7909a992281a00000f',
		content : helpers.longText,
		date : Date.now
	};

	it('add a blogpost', function(next) {
		var post = dummyBlogpost;
		post.title = null;

		request.post({
			uri: helpers.apiendpoint + "/blogposts/add",
			json: post
		}, function(err, res, body) {
			console.log(body);
			// expect(body.result).toBeDefined();
			// expect(body.result._id).toBeDefined();
			// expect(body.result._id).toMatch("^[0-9a-fA-F]{24}$");// A valid MongoId
			// expect(body.result._id).toBe(post.memberId);

			// expect(body.result.title).toBe(post.title);
			// expect(body.result.content).toBe(post.content);
			// expect(body.result.date).toBe(post.date);
		});
	});
});