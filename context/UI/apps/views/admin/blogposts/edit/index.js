var helpers = require("views/helpers")

var FileuploadView = require("views/fileupload")

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
    var created = this.model.isNew();
    this.model.save({
      title: this.$el.find("#title").val(),
      content: this.content.exportFile(),
      ingress: this.ingress.exportFile(),
      slug: this.getSlugValue()
    }, {
      success: function(){
        alert("done");
        if(created)
          app.router.navigate("blogposts/edit/"+self.model.id, true)
        else
          self.updateTimestamps();
      },
      error: helpers.handleError
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

    this.fileupload = new FileuploadView({el: this.$el.find("#fileupload")})
    this.fileupload.render()

    return this;
  },

  postRender: function(){
    this.content = new EpicEditor({
      container: "content",
      textarea: "contentData",
      basePath: "/css",
      autogrow: true,
      clientSideStorage: false
    })
    this.ingress = new EpicEditor({
      container: "ingress",
      textarea: "ingressData",
      basePath: "/css",
      autogrow: true,
      clientSideStorage: false
    })
    this.content.load();
    this.ingress.load();
  }
})