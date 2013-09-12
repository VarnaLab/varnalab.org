var helpers = require("views/helpers");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click #save": "save"
  },

  initialize: function(){
    this.model.on("invalid", helpers.handleError)
  },

  save: function(){
    var self = this;
    this.model.save({
      title: this.$el.find("#title").val(),
      description: this.description.exportFile(),
      startDateTime: this.$("#startDateTime").datetimepicker("getDate"),
      endDateTime: this.$("#endDateTime").datetimepicker("getDate")
    }, {
      success: function(){
        alert("done");
      },
      error: helpers.handleError
    })
  },

  render: function(){
    this.$el.html(this.template({
      model: this.model,
      moment: moment
    }));

    return this;
  },

  postRender: function(){
    this.description = new EpicEditor({
      container: "description",
      textarea: "descriptionData",
      basePath: "/css",
      autogrow: true,
      clientSideStorage: false
    })
    this.$("#startDateTime").datetimepicker({
      dateFormat: "mm-dd-y",
      separator: ", ",
      timeFormat: "hh:mm"
    });
    this.$("#endDateTime").datetimepicker({
      dateFormat: "mm-dd-y",
      separator: ", ",
      timeFormat: "hh:mm"
    });
    this.description.load();
  }
})