module.exports = Backbone.Collection.extend({
  parse: function(data){
    if(data.result) {
      return data.result;
    } else {
      return data;
    } 
  }
});