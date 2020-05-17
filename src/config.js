require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  TWIT_API_KEY: process.env.TWIT_API_KEY,
  TWIT_API_SECRET_KEY: process.env.TWIT_API_SECRET_KEY
}
