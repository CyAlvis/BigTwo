const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/dist"));
app.get("/", function (req, res) {
  res.sendfile("index.html");
});

function shuffle(cards, times) {
  for (let i = 1; i <= times; i++) {
    cards = cards.sort(function () {
      return 0.5 - Math.random();
    });
  }
}


var count = 0;
var allCards = [];
var player = {};
var playerNum = 0;
var pass = 0;

io.on("connection", function (socket) {
  count == 4 ? count = 1 : count++;
  console.log("玩家數：", count)
  socket.join("PlayRoom");
  if (count == 1) {
    allCards = [];
    player = {};
    playerNum = 4;
    for (let i = 1; i <= 13; i++) {
      let n;
      switch (i) {
        case 10:
          n = "I";
          break;
        case 11:
          n = "J";
          break;
        case 12:
          n = "Q";
          break;
        case 13:
          n = "R";
          break;
        default:
          n = i;
          break;
      }
      for (let type of ["C", "D", "H", "S"]) {
        allCards.push(n + type);
      }
    }
    shuffle(allCards, 100);
    for (let p = 1; p <= playerNum; p++) {
      player[p] = allCards.slice(
        (p - 1) * (52 / playerNum),
        p * (52 / playerNum)
      );
    }
  }
  socket.emit("dealCard", {
    player: count,
    cards: player[count]
  });
  if (count == 4) {
    console.log("遊戲開始！")
    io.in("PlayRoom").emit("start");
  }

  socket.on("playCard", cards => {
    let ret = {
      nextPlayer: cards.player == 4 ? 1 : cards.player+1,
      cards: cards.cards,
      cardsInfo: cards.cardsInfo
    }
    socket.broadcast.to('PlayRoom').emit('updateCard', ret);
    pass = 0;
  })

  socket.on("pass", player => {
    pass++;
    let ret = {
      allPass: false,
      nextPlayer: player == 4 ? 1 : player+1
    }
    if (pass == 3) {
      ret.allPass = true;
    }
    socket.broadcast.to('PlayRoom').emit('lastPass', ret);
  })

  socket.on("disconnect", () => {
    count--;
  })
});

server.listen(4000, () => {
  console.log("Server Started. http://localhost:4000");
});
