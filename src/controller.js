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

  let interval;
  io.on("connection", (socket) => {
    if(interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => getApiAndEmit(socket), 500000)
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  })

  function getApiAndEmit(socket) {
    const T = new Twit({
      consumer_key: TWIT_API_KEY,
      consumer_secret: TWIT_API_SECRET_KEY,
      access_token: TWIT_ACCESS_TOKEN,
      access_token_secret: TWIT_ACCESS_TOKEN_SECRET
    })

    T.get(`search/tweets`, { q: '$AAPL', count: 10 }, (err, data, response) => {
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
  }
  // let interval;
  // io.use((socket, next) => {
  //   let symbol = socket.handshake.query.symbol;
  //   if (symbol) {
  //     console.log('symbol', symbol)
  //     return next();
  //   }
  //   next()
  // })

  // io.on("connection", (socket) => {
  //   console.log("New client connected");
  //   if (interval) {
  //     clearInterval(interval);
  //   }
  //   interval = setInterval(() => getApiAndEmit(socket), 1000);
  //   socket.on("disconnect", () => {
  //     console.log("Client disconnected");
  //     clearInterval(interval);
  //   });
  // });

  // const getApiAndEmit = socket => {
  //   const response = new Date();
  //   const mathRandom = Math.random()
  //   socket.emit("get_date", response);
  //   socket.emit("get_tweets", mathRandom)
  // };
}
