

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/dist"));
app.get("/", function(req, res) {
  res.sendfile("index.html");
});

function shuffle(cards,times){
  for(let i = 1; i <= times; i++){
    cards = cards.sort(function(){
      return 0.5-Math.random();
    })
  }
};
let allCards = [],
  player= {},
  playerNum = 2;
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
      n = "K";
      break;
    default:
      n = i;
      break;
  };
  for (let type of ["C", "D", "H", "S"]) {
    allCards.push(n + type);
  };
}
shuffle(allCards,10);
for (let p = 1; p<= playerNum ; p++) {
  player[p] = allCards.slice((p-1)*(52/playerNum),p*(52/playerNum));
};


server.listen(4000, () => {
  console.log("Server Started. http://localhost:4000");
});
