const express = require("express")
const app = express()
const { engine } = require('express-handlebars')
const db = require('./models')
const Todo = db.Todo
const methOverride = require('method-override')        /*為轉變狀態之套件*/
const flash = require('connect-flash')
const session = require('express-session')

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methOverride('_method'))
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

/*設定路由：設定跳轉至首頁*/
app.get('/', (req, res) => {
  res.render('index')
})

/*設定路由：顯示從資料庫中，抓取全部的項目*/
app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    raw: true   /*將資料轉成JSON格式*/
  })
    /* 將查詢到的結果傳遞給名為'todos'的hbs檔案，並且將資料作為變數'todos'傳給樣板*/
    .then((todos) => res.render('todos', { todos, message_success: req.flash('success'), message_deleted: req.flash('deleted') }))
    .catch((error) => res.status(422).json(err))
})

/*設定路由：跳轉至新增項目之頁面*/
app.get('/todos/new', (req, res) => {
  res.render('news', { error: req.flash('error') })
})

/*設定路由：從news頁面所輸入的資料，做為一變數，並透過建立方法，將資料寫進至資料庫中，後續渲染網頁以呈現輸入過之頁面*/
app.post('/todos', (req, res) => {
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
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo, message: req.flash('edited') }))
    .catch((error) => res.status(422).json(error))
})

/*設定路由：針對單一頁面(edit)進行畫面渲染：*/
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
    .catch((error) => res.status(422).json(error))
})

/*-----------------------------*/
/*方法一：須先取得鍵值，再修改*/
// app.put('/todos/:id', (req, res) => {
//   const body = req.body
//   const id = req.params.id

//   return Todo.findByPk(id, {
//     attributes: ['id', 'name']
//   })
//     .then((todo) => {
//       todo.name = body.name
//       return todo.save()
//     })
//     .then((todo) => res.redirect(`/todos/${todo.id}`))
// })

/*----------------------------*/
/* 方法二：不須先取得鍵值，直接修改*/
app.put('/todos/:id', (req, res) => {
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
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('deleted', '刪除成功!')
      res.redirect('/todos')
    })
})

app.listen(3000, () => {
  console.log('The app is running')
})