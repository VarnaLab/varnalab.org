var fs = require("fs")
var url_parser = require("url")

module.exports = function(config, httpServer){
  return function(req, res, next){
    var pageName = url_parser.parse(req.url).pathname
    var staticPage = process.cwd()+"/context/UI/pages/static/"+pageName+".jade"
    fs.exists(staticPage, function(result){
      if(result)
        res.sendPage(staticPage)
      else
        next()
    })
  }
}