var _ = require("underscore");
module.exports.extractFormData = function(selector) {
  var arr = $(selector).serializeArray();
  var attrs = _(arr).reduce(function(data, field) {
    data[field.name] = field.value;
    return data;
  }, {});
  return attrs;
}

module.exports.handleError = function(model, error) {
  if(error.responseText) { // then it is validation error from server side
    try {
      error = JSON.parse(error.responseText);
    } catch(err) {
      error = {message: "Internal Server Error"}
    }
  }

  if(_.isObject(error)) {
    alert(JSON.stringify(error));
  } else 
    alert(error);
}