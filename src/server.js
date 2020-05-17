require('dotenv').config()
const { PORT } = require('./config')
const app = require('./app')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

let interval;
io.use((socket, next) => {
  let symbol= socket.handshake.query.symbol;
  if (symbol) {
    console.log('symbol', symbol)
    return next();
  }
  next()
})

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  const mathRandom = Math.random()
  socket.emit("get_date", response);
  socket.emit("get_tweets", mathRandom)
};

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })


