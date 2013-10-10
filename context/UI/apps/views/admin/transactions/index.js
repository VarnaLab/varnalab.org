var TransactionModel = require("models/client/Transaction");
var helpers = require("views/helpers");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  transactionItemTemplate: require("./transaction-item.jade"),
  transactionFormTemplate: require("./transaction-form.jade"),

  events: {
    "submit .form": "submit",
    "click .js-remove": "remove"
  },
  initialize: function(){
    this.collection.on("add", this.appendTransaction, this);
    this.collection.on("destroy", this.render, this);
  },
  submit: function(e){
    e.preventDefault();
    var self = this
    var model = new TransactionModel();
    model.on("error", helpers.handleError)
    model.on("invalid", helpers.handleError)

    var data = helpers.extractFormData(this.$(".form"))
    /*
     Adding +1 days because 'strangely' datepicker("getDate")
     returns one day behind of the shown selection.
    */
    data.forDate = moment(this.$("#forDate").datepicker("getDate")).add("days", 1).toDate()
    model.save(data, {
      wait: true,
      success: function(){
        self.collection.add(model);
        self.$(".form").html(self.transactionFormTemplate());
        self.postRender()
      }
    })

    return false;
  },
  remove: function(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("data-id");
    if(confirm("Are you sure you want to delete transaction?"))
      this.collection.get(id).destroy();
  },
  appendTransaction: function(transactionModel) {
    this.$el.find(".js-transactionsList").append(this.transactionItemTemplate({
      model: transactionModel
    }))
  },
  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    this.postRender()
    return this;
  },
  postRender: function(){
    this.$el.find("#forDate").datepicker({
      dateFormat: "dd-mm-yy",
      defaultDate: new Date()
    })
    this.$el.find("#forDate").datepicker("setDate", new Date())
  }
})
