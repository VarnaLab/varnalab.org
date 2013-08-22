var Organel = require("organic").Organel;
var mongoose = require("mongoose");

module.exports = Organel.extend(function Mongoose(plasma, config){
  Organel.call(this, plasma);
  
  this.config = config;

  if(config.reactOn)
    this.on(config.reactOn, this.connect)
  else
    this.connect()
  
  plasma.on("kill", function(){
    mongoose.disconnect();
    return false;
  })
}, {
  connect: function(c){
    var self = this;
    mongoose.connect('localhost', self.config.database.name, function(){
      if(self.config.recreateDatabase) {
        mongoose.connection.db.dropDatabase(function(){
          mongoose.connect('localhost', self.config.database.name, function(){
            self.emit({type: "Mongoose", data:{}});  
          });
        });
      } else {
        self.emit({type: "Mongoose", data:{}});
      }
    });
    return false; // do not aggregate c
  }
})
