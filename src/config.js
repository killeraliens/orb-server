require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET
}
