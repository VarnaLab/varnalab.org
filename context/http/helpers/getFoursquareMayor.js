module.exports = function(plasma){
  return function(req, res, next) {
    plasma.emit("foursquaremajor", function(err, data){
      if(err) return next(err)
      req.mayor = data
      next();  
    })
  }
}