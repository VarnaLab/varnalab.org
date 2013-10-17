require("coffee-script")
var mongoose = require("mongoose")
var BlogPost = require("models/server/BlogPost")
var Member = require("models/server/Member")
var parser = require('xml2json');
var fs = require('fs')

module.exports.exec = function(next) {
  var mode = process.env.CELL_MODE?process.env.CELL_MODE:""
  var dbname = require(process.cwd()+"/dna/"+mode+"/database.json").name
  mongoose.connect("localhost", dbname, function(){
    Member.findOne({}, function(err, admin){
      var xml = parser.toJson(fs.readFileSync(__dirname+"/data.xml"), {
        object: true,
        sanitize: false
      })
      var allCount = 0;
      for(var i = 0;  i< xml.feed.entry.length; i++) {
        var entry = xml.feed.entry[i]
        if(entry.category.term.indexOf("kind#post") !== -1) {
          allCount += 1
          BlogPost.create({
            creator: admin,
            created: new Date(entry.published),
            title: entry.title.$t,
            slug: entry.title.$t,
            content: entry.content.$t,
            contentType: "html"
          }, function(err, post){
            console.log(entry, err, post)
          })
        }
      }
      console.log(allCount)
    })
  })
}

if(!module.parent)
  module.exports.exec();
