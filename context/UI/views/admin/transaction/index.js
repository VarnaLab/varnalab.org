var TransactionModel = require("models/client/Transaction");
var helpers = require("views/helpers");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  transactionItemTemplate: require("./transaction-item.jade"),
  transactionFormTemplate: require("./transaction-form.jade"),

  events: {
    "submit .form": "submit"
  },
  initialize: function(){
    this.collection.on("add", this.appendTransaction, this); 
  },
  submit: function(e){
    e.preventDefault();
    
    var model = new TransactionModel();
    model.on("sync", function(){
      this.collection.add(model);
      this.$(".form").html(this.transactionFormTemplate());
    }, this);

    var data = helpers.extractFormData(this.$(".form"));
    model.save(data, {wait: true}).error(helpers.handleError)

    return false;
  },
  appendTransaction: function(transactionModel) {
    this.$(".transactionsList").append(this.transactionItemTemplate({
      transaction: transactionModel
    }))
  },
  render: function(){
    this.$el.html(this.template({
      collection: this.collection
    }))
    return this;
  }
})