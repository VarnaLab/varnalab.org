switch(process.platform) {
  case "win32": module.exports = require("./lib/Win"); break;
  case "win64": module.exports = require("./lib/Win"); break;
  case "darwin": module.exports = require("./lib/Mac"); break;
  case "linux": module.exports = require("./lib/Linux"); break;
}