const express = require("express")
const app = express()
const { engine } = require('express-handlebars')

const methOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const router = require('./routes') /*預設會抓取index.js檔案*/

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

app.use(router)

app.listen(3000, () => {
  console.log('The app is running')
})