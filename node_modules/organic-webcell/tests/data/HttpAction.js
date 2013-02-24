module.exports = function(chemical, next){
  chemical.data = this.config.dbname;
  next(chemical);
}