/*總路由設定*/
const express = require('express')
const router = express.Router()

const todos = require('./todos')
const users = require('./users')

router.use('/todos', todos)
router.use('/users', users)

/*設定路由：設定跳轉至首頁*/
router.get('/', (req, res) => {
  res.redirect('/todos')
})

module.exports = router