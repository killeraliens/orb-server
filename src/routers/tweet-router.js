const express = require('express')
const tweetRouter = express.Router()

tweetRouter.get('/', (req, res) => {
  console.log('all tweets')
  res.status(200).send({
    message: 'all tweets'
  })
})

module.exports = tweetRouter
