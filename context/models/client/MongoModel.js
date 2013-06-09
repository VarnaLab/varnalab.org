module.exports = Backbone.Model.extend({
  idAttribute: "_id",
  parse: function(data){
    data = data.result || data;
    if(data._id) {
      this.id = data._id;
      delete data._id;
    }
    return data;
  }
})