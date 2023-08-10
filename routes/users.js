const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})


module.exports = router