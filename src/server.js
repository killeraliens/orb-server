require('dotenv').config()
const { PORT } = require('./config')
const app = require('express')()
const http = require('http')
const bodyParser = require('body-parser')
const server = http.createServer(app)
const io = require('socket.io')(server)
//require('./controller')(io)

app.use(bodyParser.json());
require('./routes/index')(app, io)

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })


