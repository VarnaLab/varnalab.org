module.exports = function (req, res, next) {
  if (!req.user) return res.error('not logged')
  next()
}
