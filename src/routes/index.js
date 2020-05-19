const Twit = require('twit')
//const Twit = require('twitter')
const {
  TWIT_API_KEY,
  TWIT_API_SECRET_KEY,
  TWIT_ACCESS_TOKEN,
  TWIT_ACCESS_TOKEN_SECRET
} = require('../config')


module.exports = function (app, io) {
    let T = new Twit({
      consumer_key: TWIT_API_KEY,
      consumer_secret: TWIT_API_SECRET_KEY,
      access_token: TWIT_ACCESS_TOKEN,
      access_token_secret: TWIT_ACCESS_TOKEN_SECRET
    })

  let socketConnect;
  let twitterStream;

  app.locals.searchTerm = '#corona';

  app.post('/set-symbol', (req, res) => {
    let { term } = req.body
    app.locals.searchTerm = term;
    console.log('SETTING TERM', app.locals.searchTerm)
    if (twitterStream) twitterStream.destroy()
    res.status(200).json({ term: term })
  });

  io.on("connection", (socket) => {
    socketConnect = socket
    //getInitalTweetsAndEmit()
    setStream()
    socket.on("connect", () => {
      console.log("Client connected")
    })
    socket.on("disconnect", () => {
      console.log("Client disconnected")
    });
  })

  function getInitalTweetsAndEmit() {
    let term = app.locals.searchTerm
    console.log('streaming for ' + term)
    T.get(`search/tweets`, { q: term, count: 10 }, (err, data, response) => {
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

  function setStream() {
      let term = app.locals.searchTerm
      console.log('streaming for ' + term)
      let stream = T.stream(`statuses/filter`, { track: term })
    //  T.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
      //console.log(stream)
      stream.on('tweet', tweet => {
        let tweetBody = {
          text: tweet.text,
          userScreenName: '@' + tweet.user.screen_name,
          userImage: tweet.user.profile_image_url_https,
          userDescription: tweet.user.description
        }
        emitStream(tweetBody)
      })

      stream.on('disconnect', message => {
        console.log('twit disconnected')
      })

       stream.on('connected', message => {
         console.log('twit connected')
       })

      stream.on('error', error => {
        console.log('error in stream', error)
      })

      twitterStream = stream;
  //  })
  }
  function emitStream(tweet) {
    console.log('NEWW TWEET', tweet.userScreenName)
    socketConnect.emit('tweet', tweet)
  }

}


