require('dotenv').config()
const { NODE_ENV } = require('./config')
const app = require('express')()
const morgan = require('morgan')
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'
const helmet = require('helmet')
const cors = require('cors')
const router = require('./routers/index')
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(router)
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === "production") {
    response = { error: {message: "Server Error"} }
  } else {
    console.log(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
