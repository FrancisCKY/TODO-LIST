/*總路由設定*/
const express = require('express')
const router = express.Router()
const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const db = require('../models')
const User = db.User
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'email錯誤哦' })
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err)
        }
        if (!isMatch) {
          return done(null, false, { message: "密碼錯誤哦" })
        }

        return done(null, user)
      })
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})

router.use('/todos', authHandler, todos)
router.use('/users', users)

/*設定路由：設定跳轉至首頁*/
router.get('/', (req, res) => {
  res.redirect('/users/login')
})



module.exports = router