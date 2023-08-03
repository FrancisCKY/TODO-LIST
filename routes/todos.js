const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo


/*設定路由：顯示從資料庫中，抓取全部的項目*/
router.get('/', (req, res) => {
  try {
    return Todo.findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true   /*將資料轉成JSON格式*/
    })
      /* 將查詢到的結果傳遞給名為'todos'的hbs檔案，並且將資料作為變數'todos'傳給樣板*/
      .then((todos) => res.render('todos', { todos, message_success: req.flash('success'), message_deleted: req.flash('deleted'), error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

/*設定路由：跳轉至新增項目之頁面*/
router.get('/new', (req, res) => {
  try {
    res.render('news', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

/*設定路由：從news頁面所輸入的資料，做為一變數，並透過建立方法，將資料寫進至資料庫中，後續渲染網頁以呈現輸入過之頁面*/
router.post('/', (req, res) => {
  try {
    const name = req.body.name
    return Todo.create({ name })
      .then(() => {
        req.flash('success', '新增成功!')
        res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '新增失敗')
        return res.redirect('/todos/new')
      })
  } catch (error) {
    console.error(error)
    return res.redirect('/todos/new')
  }
})

/*設定路由：針對單一頁面(todo)進行畫面渲染*/
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('todo', { todo, message: req.flash('edited'), error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

/*設定路由：針對單一頁面(edit)進行畫面渲染：*/
router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

/*不須先取得鍵值，直接修改*/
router.put('/:id', (req, res) => {
  try {
    const { name, isComplete } = req.body
    const id = req.params.id

    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      .then(() => {
        req.flash('edited', '修改成功!')
        res.redirect(`/todos/${id}`)
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '修改失敗')
        return res.redirect(`/todos/${id}/edit`)
      })
  } catch (error) {
    console.error(error)
    return res.redirect(`/todos/${id}/edit`)
  }
})

/*路由設定：透過參數取得，進行刪除項目*/
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('deleted', '刪除成功!')
        res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '刪除失敗')
        res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

module.exports = router