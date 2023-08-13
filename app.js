const express = require("express")
const app = express()
const { engine } = require('express-handlebars')
const methOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const router = require('./routes') /*預設會抓取index.js檔案*/
const messagehandler = require('./middlewares/message-handler')
const errorhandler = require('./middlewares/error-handler')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.SESSION_SECRET)

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }))
app.use(methOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(messagehandler)
app.use(router)
app.use(errorhandler)
app.use(passport.initialize())
app.use(passport.session())

app.listen(3000, () => {
  console.log('The app is running')
})