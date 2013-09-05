module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  
  events: {
    "click #save": "save"
  },

  render: function(){
    this.$el.html(this.template({
      model: this.model
    }));

    return this;
  },

  save: function(){
    this.model.save({
      title: this.$el.find("#title").val(),
      content: this.editor.exportFile()
    }, {
      success: function(){
        alert("done");
      }
    })
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