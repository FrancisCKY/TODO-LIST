const express = require("express")
const app = express()
const { engine } = require('express-handlebars')
const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true   /*將資料轉成JSON格式*/
  })
    .then((todos) => res.render('todos', { todos }))   /* 將查詢到的結果傳遞給名為'todos'的hbs檔案，並且將資料作為變數'todos'傳給樣板*/
    .catch((error) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  res.render('news')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect('/todos'))
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
