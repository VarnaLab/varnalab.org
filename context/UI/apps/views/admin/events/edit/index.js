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
      startDateTime: this.$("#startDateTime").data("datetimepicker").getLocalDate(),
      endDateTime: this.$("#endDateTime").data("datetimepicker").getLocalDate(),
      broadcastEvent: this.$el.find("#broadcastEvent").is(':checked')
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
    this.$("#startDateTime").datetimepicker()
    this.$("#startDateTime").data("datetimepicker").setLocalDate(this.model.get("startDateTime"))
    this.$("#endDateTime").datetimepicker()
    this.$("#endDateTime").data("datetimepicker").setLocalDate(this.model.get("endDateTime"))
    this.description.load();
  }
})
