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

var room = {};
var userSet = {};

io.on("connection", function (socket) {
  socket.on("join", name => {
    let getRoom = 0;
    let i = 0;
    let roomList = Object.keys(room);
    while (getRoom === 0) {
      if (i >= roomList.length) {
        let j = 1;
        let createRoom = 0;
        while (createRoom === 0) {
          if (!roomList.includes(j.toString())) {
            createRoom = j;
            userSet[socket.id] = j;
            socket.join(j);
            getRoom = j;
            room[j] = {
              count: 1,
              playerList: {
                1: name,
                2: "",
                3: "",
                4: ""
              },
              pass: 0,
              allCards: {},
              first: 0
            }
            let temp = [];
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
                temp.push(n + type);
              }
            }
            shuffle(temp, 100);
            for (let p = 1; p <= 4; p++) {
              room[j].allCards[p] = temp.slice(
                (p - 1) * (52 / 4),
                p * (52 / 4)
              );
            }
            io.in(j).emit("updatePlayerList", room[j].playerList);
            socket.emit("dealCard", {
              playerOrder: 1,
              cards: room[j].allCards[1]
            })
            room[j].allCards[1].includes('3C') ? room[j].first = 1 : 1;

          }
          j++;
        }
      } else {
        let roomNo = roomList[i];
        let count = room[roomNo].count;
        if (count != 4) {
          userSet[socket.id] = roomNo;          
          socket.join(roomNo);
          count++;
          getRoom = roomNo;
          room[roomNo].count++;
          room[roomNo].playerList[count] = name;
          io.in(roomNo).emit("updatePlayerList", room[roomNo].playerList);
          socket.emit("dealCard", {
            playerOrder: count,
            cards: room[roomNo].allCards[count]
          })
          room[roomNo].allCards[count].includes('3C') ? room[roomNo].first = count : 1;
          if (count == 4) {
            console.log("遊戲開始！")
            io.in(roomNo).emit("start",room[roomNo].first);
          }
        }
      }
      i++;
    }
  });

  socket.on("playCard", cards => {
    let ret = {
      nextPlayer: cards.player == 4 ? 1 : cards.player + 1,
      cards: cards.cards,
      cardsInfo: cards.cardsInfo
    }
    socket.broadcast.to(userSet[socket.id]).emit('updateCard', ret);
    room[userSet[socket.id]].pass = 0;
  })

  socket.on("pass", player => {
    room[userSet[socket.id]].pass++;
    let ret = {
      allPass: false,
      nextPlayer: player == 4 ? 1 : player + 1
    }
    if (room[userSet[socket.id]].pass == 3) {
      ret.allPass = true;
    }
    socket.broadcast.to(userSet[socket.id]).emit('lastPass', ret);
  })

  socket.on("win", player => {
    socket.broadcast.to(userSet[socket.id]).emit('otherWin', player);
  })

  socket.on("disconnect", () => {
    socket.leave(userSet[socket.id]);
    delete userSet[socket.id];
  })
});

server.listen(4000, () => {
  console.log("Server Started. http://localhost:4000");
});
