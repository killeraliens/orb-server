const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  console.log('connection on sockets')
  res.end()
})

router.get('/tweets', (req, res) => {
  console.log('all tweets')
  res.status(200).send({
    message: 'all tweets'
  })
})

module.exports = router
