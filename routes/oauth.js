const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/users/login',
  failureFlash: true
}))

module.exports = router