module.exports.map = function(actions, rootUrl, mapHandler) {
  var root = actions.root || rootUrl;
  for(var key in actions) {
    var parts = key.split(" ");
    var method = parts.shift();
    var url = parts.pop();
    var actionHandler = actions[key];
    if(typeof actionHandler === "string") {
      actionHandler = actions[actionHandler];
      if(typeof actionHandler !== "function" && !Array.isArray(actionHandler))
        throw new Error(actionHandler+" was not found");
    }
    mapHandler(method, root+(url?url:""), actionHandler);
  }
}