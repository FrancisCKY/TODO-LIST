const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const bcrypt = require('bcrypt')

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmpassword = req.body.confirmpassword

  if (password !== confirmpassword) {
    req.flash('error', '輸入密碼與確認密碼不符合')
    return res.redirect('/users/register')
  }

  User.findOne({ where: { email: email } })
    .then(existingUser => {
      if (existingUser) {
        req.flash('error', '該email已註冊')
        return res.redirect('/users/register')
      }

      if (!email || !password) {
        req.flash('error', '請輸入資料')
        return res.redirect('/users/register')
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          req.flash('error', '加密過程錯誤')
          return next(err)
        }

        User.create({ name, email, password: hash })
          .then(() => {
            req.flash('success', '註冊成功!')
            res.redirect('/users/login')
          })
          .catch((err) => {
            req.flash('error', '註冊失敗')
            next(err)
          })
      })
    })
})

router.post('/todos', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        req.flash('error', '找不到該使用者')
        return res.redirect('/users/login')
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          req.flash('error', '登入過程錯誤')
          return next(err)
        }
        if (result) {
          req.session.user = user
          req.flash('success', '登入成功')
          return res.redirect('/todos')
        } else {
          req.flash('error', '密碼錯誤')
          return res.redirect('/users/login')
        }
      })
    })
    .catch(err => {
      req.flash('error', '登入過程錯誤')
      next(err)
    })
})

module.exports = router