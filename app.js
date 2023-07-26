const express = require("express")
const app = express()
const { engine } = require('express-handlebars')
const db = require('./models')
const Todo = db.Todo
const methOverride = require('method-override')        /*為轉變狀態之套件*/

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methOverride('_method'))

/*設定路由：設定跳轉至首頁*/
app.get('/', (req, res) => {
  res.render('index')
})

/*設定路由：顯示從資料庫中，抓取全部的項目*/
app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true   /*將資料轉成JSON格式*/
  })
    /* 將查詢到的結果傳遞給名為'todos'的hbs檔案，並且將資料作為變數'todos'傳給樣板*/
    .then((todos) => res.render('todos', { todos }))
    .catch((error) => res.status(422).json(err))
})

/*設定路由：跳轉至新增項目之頁面*/
app.get('/todos/new', (req, res) => {
  res.render('news')
})

/*設定路由：從news頁面所輸入的資料，做為一變數，並透過建立方法，將資料寫進至資料庫中，後續渲染網頁以呈現輸入過之頁面*/
app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect('/todos'))
})

/*設定路由：針對單一頁面(todo)進行畫面渲染*/
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((error) => res.status(422).json(error))
})

/*設定路由：針對單一頁面(edit)進行畫面渲染：*/
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => res.status(422).json(error))
})

/*
方法一：須先取得鍵值，再修改
app.put('/todos/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return Todo.findByPk(id,{
      attributes:['id','name']
  })
      .then((todo) => {
        todo.name = body.name
          return todo.save()
      })
      .then((todo) => res.redirect(`/todos/${todo.id}`))
})
*/

/*----------------------------*/
/* 方法二：不須先取得鍵值，直接修改*/
app.put('/todos/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return Todo.update({ name: body.name }, { where: { id } })
    .then(() => res.redirect(`/todos/${id}`))
})

app.delete('/todos/:id', (req, res) => {
  res.send(`todo id ${req.params.id} has been deleted`)
})

app.listen(3000, () => {
  console.log('The app is running')
})
