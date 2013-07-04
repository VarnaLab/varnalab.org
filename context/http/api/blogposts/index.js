module.exports = function (config) {
  var BlogPost = require(config.models + '/BlogPost');
  return {
    'GET' : function (req, res) {
      BlogPost.find({}, function(err, blogposts) {
        if (err) return res.error(err);
        res.result(blogposts);
      });
    },
    'POST /add' : function (req, res) {
      if (!/^[0-9a-fA-F]{24}$/i.test(req.body.member)) {
        return res.error({
          message: 'Validation failed',
          name : 'ValidationError',
          errors : {
            member : {
              message : 'Invalid member id provided',
              name : 'ValidationError',
              path : 'member',
              type : 'ObjectId'
            }
          }
        });
      }
      BlogPost.create(req.body, function (err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    },
    'POST /:id' : function (req, res) {
      BlogPost.findOne(req.params.id, function(err, blogpost) {
        if (err) return res.error(err);
        res.result(blogpost);
      });
    }
    //@todo PUT request ?
    //@todo DELETE request ?
  }
}