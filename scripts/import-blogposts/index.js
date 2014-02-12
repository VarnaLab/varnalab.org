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
      xml.feed.entry.forEach(function(entry){
        if(entry.category.term.indexOf("kind#post") !== -1) {
          allCount += 1
          BlogPost.findOne({
            title: entry.title.$t
          }, function(err, blog){
            if(blog) return
            BlogPost.create({
              creator: admin,
              created: new Date(entry.published),
              updated: new Date(entry.updated),
              title: entry.title.$t,
              slug: entry.title.$t,
              content: entry.content.$t
            }, function(err, post){
              console.log("Inserted", entry.title.$t, allCount)
            })
          })
        }
      })
      console.log("Will insert total", allCount)
    })
  })
}

if(!module.parent)
  module.exports.exec();
