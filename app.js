const express = require("express")
const app = express()
const db = require('./models')
const Todo = db.Todo

app.get('/', (req, res) => {
  res.send("hello world!")
})

app.get('/todos', (req, res) => {
  return Todo.findAll()
    .then((todos) => res.send(todos))
})

app.post('/todos', (req, res) => {
  res.send('add todos')
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
