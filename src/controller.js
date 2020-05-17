const T = require('twit')

module.exports = function(io) {
  let interval;
  io.use((socket, next) => {
    let symbol = socket.handshake.query.symbol;
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
}
