const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  console.log('this is the date')
  res.status(200).send({
    message: 'welcome'
  })
})

router.get('/tweets', (req, res) => {
  console.log('all tweets')
  res.status(200).send({
    message: 'all tweets'
  })
})

module.exports = router
