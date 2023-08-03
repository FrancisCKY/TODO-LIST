/*總路由設定*/
const express = require('express')
const router = express.Router()

const todos = require('./todos')

router.use('/todos', todos)

/*設定路由：設定跳轉至首頁*/
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router