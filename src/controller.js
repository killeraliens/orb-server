const Twit = require('twit')
const {
  TWIT_API_KEY,
  TWIT_API_SECRET_KEY,
  TWIT_ACCESS_TOKEN,
  TWIT_ACCESS_TOKEN_SECRET } = require('./config')

module.exports = function(io) {
  io.use((socket, next) => {
    let symbol = socket.handshake.query.symbol;
    if (symbol) {
      console.log('symbol', symbol)
      return next();
    }
    next()
  })

  io.on("connection", (socket) => {
    console.log("Client connected")
    getApiAndEmit(socket)
    socket.on("disconnect", () => {
      console.log("Client disconnected")
    });
  })

  function getApiAndEmit(socket) {
    const T = new Twit({
      consumer_key: TWIT_API_KEY,
      consumer_secret: TWIT_API_SECRET_KEY,
      access_token: TWIT_ACCESS_TOKEN,
      access_token_secret: TWIT_ACCESS_TOKEN_SECRET
    })

    T.get(`search/tweets`, { q: '#corona', count: 10 }, (err, data, response) => {
      const tweets = []
      for (let i = 0; i < data.statuses.length; i++) {
        const tweet = data.statuses[i]
        let tweetBody = {
          text: tweet.text,
          userScreenName: '@' + tweet.user.screen_name,
          userImage: tweet.user.profile_image_url_https,
          userDescription: tweet.user.description
        }
        try {
          if (tweet.entities.media[0].media_url_https) {
            tweetBody.image = tweet.entities.media[0].media_url_https
          }
        } catch (err) { }
        tweets.push(tweetBody)
      }
      socket.emit('allTweets', tweets)
    })

    T.stream(`statuses/filter`, { track: '#corona' }).on('tweet', (tweet) => {
      socket.emit('tweet', { ...tweet} )
    })
  }
}
