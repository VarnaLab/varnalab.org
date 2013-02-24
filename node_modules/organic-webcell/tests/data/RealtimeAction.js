module.exports = function(chemical, next) {
  chemical.data += " world";
  next(chemical);
}