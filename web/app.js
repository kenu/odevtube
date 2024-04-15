import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import expressSession from 'express-session'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  expressSession({
    secret: 'github cat',
    resave: true,
    saveUninitialized: true,
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('view options', { rmWhitespace: true })

app.use(helmet.hidePoweredBy())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

import 'dotenv/config'
import passport from 'passport'
import GitHub from 'passport-github2'

try {
  passport.use(
    new GitHub.Strategy(
      {
        clientID: process.env['GITHUB_CLIENT_ID'],
        clientSecret: process.env['GITHUB_CLIENT_SECRET'],
        callbackURL: process.env['HOST']+'/login/github/return',
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log('accessToken', accessToken)
        return cb(null, profile)
      }
    )
  )
} catch(e) {
  console.log(e)
}

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

import indexRouter from './routes/index.js'
app.use('/', indexRouter)
import adminRouter from './routes/admin.js'
app.use('/', adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
