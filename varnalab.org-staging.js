process.env.CELL_MODE = "_staging"
var instance = new (require("./index"))()
instance.start(function(err){
  if(err) throw err
})