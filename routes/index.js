/*總路由設定*/
const express = require('express')
const router = express.Router()
const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')
const oauth = require('./oauth')


router.use('/oauth', oauth)
router.use('/todos', authHandler, todos)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router