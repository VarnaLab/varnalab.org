var _ = require("underscore");
module.exports.extractFormData = function(selector) {
  var arr = $(selector).serializeArray();
  var attrs = _(arr).reduce(function(data, field) {
    data[field.name] = field.value;
    return data;
  }, {});
  return attrs;
}

module.exports.handleError = function(err) {
  console.log(err);
}