var nargs = /\{([0-9a-zA-Z]+)\}/g
var slice = Array.prototype.slice

// copy over https://github.com/Matt-Esch/string-template/blob/master/index.js
// to fix unwanted nulling of not found placeholders
var format = function (string) {
  var args

  if (arguments.length === 2 && typeof arguments[1] === 'object') {
    args = arguments[1]
  } else {
    args = slice.call(arguments, 1)
  }

  if (!args || !args.hasOwnProperty) {
    args = {}
  }

  return string.replace(nargs, function replaceArg (match, i, index) {
    var result

    if (string[index - 1] === '{' &&
      string[index + match.length] === '}') {
      return i
    } else {
      result = args.hasOwnProperty(i) ? args[i] : null
      if (result === null || result === undefined) {
        return '{' + i + '}'
      }

      return result
    }
  })
}

module.exports = function (src, data) {
  for (var key in src) {
    if (typeof src[key] === 'string') {
      src[key] = format(src[key], data)
    }
    if (typeof src[key] === 'object') {
      module.exports(src[key], data)
    }
  }
}
