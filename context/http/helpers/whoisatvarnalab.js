module.exports = function(plasma) {
  return function(req, res, next){
    plasma.emit("whoisatvarnalab", function(err, data){
      if(err) return next(err)
      res.locals.whoisatvarnalab = data
      next();  
    })
  }
}