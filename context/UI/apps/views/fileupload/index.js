module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  uploadedItem: require("./item.jade"),
  render: function(){
    var self = this
    this.$el.html(this.template({model: this.model}))
    var $uploadedList = this.$el.find(".uploadedList")
    this.$el.find("input.fileupload").fileupload({
      dataType: 'json',
      done: function (e, data) {
        var results = data.result.result
        for(var i = 0; i<results.length; i++) {
          results[i].host = window.location.host
          $uploadedList.append(self.uploadedItem(results[i]))
        }
      }
    });
    return this
  }
})