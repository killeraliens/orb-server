const { PORT } = require('./config')
const app = require('./app')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
require('./controller')(app, io)

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })


