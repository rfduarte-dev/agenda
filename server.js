require('dotenv').config()

const express = require('express')
const app = express()

// Mongoose - modelar a base de dados
const mongoose = require('mongoose')

//conectando na base de dados --------------------
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.emit('pronto')
  })
  .catch((e) => console.log(e))

// ------------------------------------------------

// Conectando as Session
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

// ------------------------------------------------

// Rotas - referente a rodas da aplicação
const routes = require('./routes')

// ------------------------------------------------

// Path - para trabalhar com caminhos
const path = require('path')

// ------------------------------------------------

// Helmet e CSRF - Segurança
const helmet = require('helmet')
const csrf = require('csurf')

// ------------------------------------------------

const {
  middlewareGlobal,
  checkCSRFError,
  csrfMiddleware
} = require('./src/middlewares/middleware')

// ------------------------------------------------

// Permiter postar formularios para dentro da aplicação
app.use(express.urlencoded({ extended: true })) // <-
app.use(express.json()) // <-

// ------------------------------------------------

// Arquivos estático
// -- por exemplo, imagens, css, js
app.use(express.static(path.resolve(__dirname, 'public')))

// ------------------------------------------------

// Configurando Session
const sessionOptions = session({
  secret: 'sadasdasdada',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, //igual uma semana
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())

// ------------------------------------------------

// Views - são arquivos que renderizamos na tela
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

// ------------------------------------------------

// Usando Helmet e CSRF
app.use(helmet())
app.use(csrf())

// ------------------------------------------------

// Nossos middlewares
app.use(middlewareGlobal)
app.use(checkCSRFError)
app.use(csrfMiddleware)

// Chamando as rotas
app.use(routes)

// ------------------------------------------------

// Escutando as coisas da aplicação
app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
  })
})
