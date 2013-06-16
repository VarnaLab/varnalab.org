describe("blogposts", function() {
	var helpers = require('../helpers');
	var request = require('request');

	it('boots', function(next) {
		helpers.boot(next);
	});

	var dummyBlogpost = {
		title : helpers.shortText,
		memberId : '51bb2b7909a992281a00000f',
		content : helpers.longText,
		date : 1371396166321
	};

	it('does not add blogpost without title', function(next) {
		var post = dummyBlogpost;
		post.title = null;

		request.post({
			uri: helpers.apiendpoint + "/blogposts/add",
			json: post
		}, function(err, res, body) {
			
		});
	});
});