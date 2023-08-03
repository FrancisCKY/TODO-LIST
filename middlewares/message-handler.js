module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.deleted_msg = req.flash('deleted')
  res.locals.edited_msg = req.flash('edited')
  res.locals.error_msg = req.flash('error')

  next()
}