const express = require('express')
const dateRouter = express.Router()

dateRouter.get('/', (req, res) => {
  console.log('this is the date')
  res.status(200).send({
    message: 'this is the date'})
})

module.exports = dateRouter
