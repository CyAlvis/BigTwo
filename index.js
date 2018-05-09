const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/dist"));
app.get("/", function(req, res) {
  res.sendfile("index.html");
});

server.listen(4000, () => {
    console.log("Server Started. http://localhost:4000");
  });
  