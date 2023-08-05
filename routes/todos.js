const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo


/*設定路由：顯示從資料庫中，抓取全部的項目*/
router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10

  return Todo.findAndCountAll({
    attributes: ['id', 'name', 'isComplete'],
    offset: (page - 1) * limit,
    limit,
    raw: true   /*將資料轉成JSON格式*/
  })
    /* 將查詢到的結果傳遞給名為'todos'的hbs檔案，並且將資料作為變數'todos'傳給樣板*/
    .then(({ rows: todos, count }) => {
      const totalPages = Math.ceil(count / limit)
      res.render('todos', {
        todos,
        home: 1,
        prev: page > 1 ? page - 1 : page,
        next: page < totalPages ? page + 1 : page,
        last: totalPages,
        page
      })
    })
    .catch((error) => {
      error.errormessage = '資料取得失敗'
      next(error)
    })
})

/*設定路由：跳轉至新增項目之頁面*/
router.get('/new', (req, res) => {
  try {
    res.render('news')
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

/*設定路由：從news頁面所輸入的資料，做為一變數，並透過建立方法，將資料寫進至資料庫中，後續渲染網頁以呈現輸入過之頁面*/
router.post('/', (req, res, next) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/todos')
    })
    .catch((error) => {
      error.errormessage = '新增失敗'
      next(error)
    })
})

/*設定路由：針對單一頁面(todo)進行畫面渲染*/
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((error) => {
      error.errormessage = '資料取得失敗'
      next(error)
    })
})

/*設定路由：針對單一頁面(edit)進行畫面渲染：*/
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => {
      error.errormessage = '資料取得失敗'
      next(error)
    })
})

/*不須先取得鍵值，直接修改*/
router.put('/:id', (req, res, next) => {
  const { name, isComplete } = req.body
  const id = req.params.id

  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('edited', '修改成功!')
      res.redirect(`/todos/${id}`)
    })
    .catch((error) => {
      error.errormessage = '修改失敗'
      next(error)
    })
})

/*路由設定：透過參數取得，進行刪除項目*/
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('deleted', '刪除成功!')
      res.redirect('/todos')
    })
    .catch((error) => {
      error.errormessage = '刪除失敗'
      next(error)
    })
})

module.exports = router