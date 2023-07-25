const express = require("express")
const app = express()
const { engine } = require('express-handlebars')
const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))

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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((error) => res.status(422).json(error))
})


app.put('/todos/:id', (req, res) => {
  res.send(`todo id ${req.params.id} has been modified`)
})

app.delete('/todos/:id', (req, res) => {
  res.send(`todo id ${req.params.id} has been deleted`)
})

app.listen(3000, () => {
  console.log('The app is running')
})
