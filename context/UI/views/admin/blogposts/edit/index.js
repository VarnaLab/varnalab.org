module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  modifiedTemplate: require("./modified.jade"),
  
  events: {
    "click #save": "save"
  },

  getSlugValue: function(){
    var slugVal = this.$el.find("#slug").val();
    if(slugVal.length == 0)
      return this.$el.find("#title").val().split(" ").join("-");
    else
      return slugVal
  },

  save: function(){
    var self = this;
    this.model.save({
      title: this.$el.find("#title").val(),
      content: this.editor.exportFile(),
      slug: this.getSlugValue()
    }, {
      success: function(){
        alert("done");
        self.updateTimestamps();
      }
    })
  },

  updateTimestamps: function(){
    this.$el.find("#modified").html(this.modifiedTemplate({
      model: this.model,
      moment: moment
    }));
  },

  render: function(){
    this.$el.html(this.template({
      model: this.model,
      moment: moment
    }));

    return this;
  },

  postRender: function(){
    this.editor = new EpicEditor({
      container: "editor",
      textarea: "content",
      basePath: "/css",
      autogrow: true
    })
    this.editor.load();
  }
})