const Twit = require('twit')
const {
  TWIT_API_KEY,
  TWIT_API_SECRET_KEY,
  TWIT_ACCESS_TOKEN,
  TWIT_ACCESS_TOKEN_SECRET } = require('./config')


module.exports = function(app, io) {
  let socketConnect
  let searchTerm = '#corona'
  //app.locals.searchTerm = '#corona';
  const T = new Twit({
    consumer_key: TWIT_API_KEY,
    consumer_secret: TWIT_API_SECRET_KEY,
    access_token: TWIT_ACCESS_TOKEN,
    access_token_secret: TWIT_ACCESS_TOKEN_SECRET
  })

  io.use((socket, next) => {
    let symbol = socket.handshake.query.symbol;
    if (symbol) {
      console.log('symbol', symbol)
      searchTerm = symbol
      return next();
    }
    next()
  })

  io.on("connection", (socket) => {
    console.log("Client connected")
    socketConnect = socket
    getInitalTweetsAndEmit()
    getStreamAndEmit()
    socket.on("disconnect", () => {
      console.log("Client disconnected")
    });
  })

  function getInitalTweetsAndEmit() {
    // let term = app.locals.searchTerm
    T.get(`search/tweets`, { q: searchTerm, count: 10 }, (err, data, response) => {
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
      socketConnect.emit('allTweets', tweets)
    })
  }

  function getStreamAndEmit() {
    // let term = app.locals.searchTerm
    T.stream(`statuses/filter`, { track: searchTerm }).on('tweet', (tweet) => {
      let tweetBody = {
        text: tweet.text,
        userScreenName: '@' + tweet.user.screen_name,
        userImage: tweet.user.profile_image_url_https,
        userDescription: tweet.user.description
      }
      console.log('NEWW TWEET', tweetBody.userScreenName)
      socketConnect.emit('tweet', { ...tweetBody} )
    })
  }
}

