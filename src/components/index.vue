<template>
  <div id="container">
    <div v-if="isName==false">
      <input v-model="name" placeholder="請輸入你的暱稱" />
      <button @click="enter" type="button">進入</button>
    </div>
    <div v-if="isName==true" id="table">
      <div id="top">
        <span class="note">top</span>
        <div style="width:30%; " class="left">
          <span v-if="yourTurn == playerOrder">換你了</span>
        </div>
        <div style="width:40%;position:relative;" class="center">
          <span style="position:absolute;top:40%;left:30%;width:40%;text-align:center;height:20%" v-if="playerList[playerOrder+2>4?playerOrder-2:playerOrder+2]!=false">{{playerList[playerOrder+2>4?playerOrder-2:playerOrder+2]}}</span>
          <span style="position:absolute;top:40%;left:40%;width:20%;text-align:center;height:20%" v-if="playerList[playerOrder+2>4?playerOrder-2:playerOrder+2]==false">等待中</span>
        </div>
        <div style="width:30%" class="right">
        </div>
      </div>
      <div id="middle">
        <span class="note">middle</span>
        <div style="width:20%;position:relative;" class="left">
          <span style="position:absolute;top:46%;left:10%;width:80%;text-align:center;height:8%" v-if="playerList[playerOrder+1>4?playerOrder-3:playerOrder+1]!=false">{{playerList[playerOrder+1>4?playerOrder-3:playerOrder+1]}}</span>
          <span style="position:absolute;top:40%;left:40%;width:20%;text-align:center;height:20%" v-if="playerList[playerOrder+1>4?playerOrder-3:playerOrder+1]==false">等待中</span>
        </div>
        <div style="width:60%" class="center">
          <img ref="showCard" :style="`left:${(100-showCardWidthPer)/10*index+(100-(showCards.length-1)*((100-showCardWidthPer)/10)-showCardWidthPer)/2}%;`" v-for="(card,index) in showCards" :src="`/static/cards/${card}.jpg`" />
        </div>
        <div style="width:20%;position:relative;" class="right">
          <span style="position:absolute;top:46%;left:10%;width:80%;text-align:center;height:8%" v-if="playerList[playerOrder+3>4?playerOrder-1:playerOrder+3]!=false">{{playerList[playerOrder+3>4?playerOrder-1:playerOrder+3]}}</span>
          <span style="position:absolute;top:40%;left:40%;width:20%;text-align:center;height:20%" v-if="playerList[playerOrder+3>4?playerOrder-1:playerOrder+3]==false">等待中</span>
        </div>
      </div>
      <div id="bottom">
        <span class="note">bottom</span>
        <div style="width:10%" class="left">
        </div>
        <div ref="cardPlace" style="width:80%" class="center">
          <img v-if="isStart" ref="card" @mousedown="chooseCard(index)" :style="`left:${((96-cardWidthPer)/12)*index+2+(13-cards.length)*((96-cardWidthPer)/12/2)}%;`" v-for="(card,index) in sortCards" :src="`/static/cards/${card}.jpg`" />
          <span style="position:absolute;top:40%;left:45%;width:10%;text-align:center;height:20%" v-if="!isStart">等待中</span>
        </div>
        <div style="width:10%" class="right">
          <div class="button">
            <button @click="playCard" :disabled="yourTurn!=playerOrder || !checkCards">出牌</button>
            <button @click="pass" :disabled="yourTurn!=playerOrder || cards.includes('3C')">Pass</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        name: "",
        isName: false,
        cards: [],
        cardWidthPer: 0,
        showCardWidthPer: 0,
        chosenCards: [],
        chosenCardInfo: {
          type: "",
          value: ""
        },
        showCards: [],
        lastCardsInfo: {
          type: "",
          value: ""
        },
        yourTurn: 0,
        allPass: false,
        playerOrder: 0,
        playerList: {
          1: "",
          2: "",
          3: "",
          4: ""
        },
        isStart: false,
      }
    },
    computed: {
      sortCards() {
        return this.cards.sort();
      },
      checkCards() {
        let result = false;
        let lastCards = this.lastCardsInfo;
        let cards = this.chosenCardInfo;
        if (lastCards.type != false) {
          switch (lastCards.type) {
            case "single":
              if (cards.type == "fourOfKind" || (cards.type == "single" && this.valueCompare(cards.value, lastCards.value))) result = true;
              break;
            case "pair":
              if (cards.type == "fourOfKind" || cards.type == "straightFlush" || (cards.type == "pair" && this.valueCompare(cards.value, lastCards.value))) result = true;
              break;
            case "straight":
              if (cards.type == "fourOfKind" || cards.type == "straightFlush") {
                result = true;
              } else if (cards.type == "straight") {
                if (cards.value.substring(0, 1) == 1) {
                  if (lastCards.value.substring(0, 1) == 1 && cards.value > lastCards.value) {
                    result = true;
                  }
                } else if (lastCards.value.substring(0, 1) == 1) {
                  if (!(cards.value.substring(0, 1) == 1 && cards.value < lastCards.value)) {
                    result = true;
                  }
                } else if (this.valueCompare(cards.value, lastCards.value)) {
                  result = true;
                }
              };
              break;
            case "straightFlush":
              if (cards.type == "straightFlush") {
                if (cards.value.substring(0, 1) == 1) {
                  if (lastCards.value.substring(0, 1) == 1 && cards.value > lastCards.value) {
                    result = true;
                  }
                } else if (lastCards.value.substring(0, 1) == 1) {
                  if (!(cards.value.substring(0, 1) == 1 && cards.value < lastCards.value)) {
                    result = true;
                  }
                } else if (this.valueCompare(cards.value, lastCards.value)) {
                  result = true;
                }
              };
              break;
            case "fullHouse":
              if (cards.type == "fourOfKind" || cards.type == "straightFlush" || (cards.type == "fullHouse" && this.valueCompare(cards.value, lastCards.value))) result = true;
              break;
            case "fourOfKind":
              if (cards.type == "straightFlush" || (cards.type == "fourOfKind" && this.valueCompare(cards.value, lastCards.value))) result = true;
              break;
          };
        } else {
          if (this.allPass) {
            if (cards.type != false) {
              result = true;
            }
          } else {
            if (this.chosenCards.includes('3C')) {
              if (cards.type != false) {
                result = true;
              }
            };
          };
        }
        return result;
      }
    },
    methods: {
      enter() {
        if (this.name != false) {
          this.isName = true;
          this.$socket.emit("join", this.name);
        } else {
          alert("請輸入暱稱！");
        }
      },
      chooseCard(index) {
        this.chosenCardInfo.type = "";
        this.chosenCardInfo.value = "";
        if (this.chosenCards.includes(this.cards[index])) {
          // 取消卡片
          let n = this.chosenCards.indexOf(this.cards[index]);
          this.chosenCards.splice(n, 1);
          this.$refs.card[index].style.top = "5%";
          this.$refs.card[index].style.border = "";
          this.$refs.card[index].style.borderRadius = "";
        } else {
          // 選取卡片
          this.chosenCards.push(this.cards[index]);
          this.$refs.card[index].style.top = "-5%";
          this.$refs.card[index].style.border = "1px solid red";
          this.$refs.card[index].style.borderRadius = "12px";
        }
        this.analysisCards();
      },
      playCard() {
        this.showCards = this.chosenCards;
        for (let element of this.chosenCards) {
          let index = this.cards.indexOf(element);
          this.cards.splice(index, 1);
        }
        if (this.cards.length == 0) {
          this.$socket.emit("win", this.name);
          alert("Congratulations! You win!");
        } else {
          this.$socket.emit("playCard", {
            player: this.playerOrder,
            cards: this.chosenCards,
            cardsInfo: this.chosenCardInfo
          })
        }
        for (let i = 0; i < this.cards.length; i++) {
          this.$refs.card[i].style.top = "5%";
          this.$refs.card[i].style.border = "";
          this.$refs.card[i].style.borderRadius = "";
        }
        this.chosenCards = [];
        this.chosenCardInfo.type = "";
        this.chosenCardInfo.value = "";
        this.lastCardsInfo.type = "";
        this.lastCardsInfo.value = "";
        this.yourTurn = 0;
      },
      pass() {
        this.$socket.emit("pass", this.playerOrder);
        for (let i = 0; i < this.cards.length; i++) {
          this.$refs.card[i].style.top = "5%";
          this.$refs.card[i].style.border = "";
          this.$refs.card[i].style.borderRadius = "";
        }
        this.chosenCards = [];
        this.chosenCardInfo.type = "";
        this.chosenCardInfo.value = "";
        this.lastCardsInfo.type = "";
        this.lastCardsInfo.value = "";
        this.yourTurn = 0;
      },
      analysisCards() {
        this.chosenCards = this.chosenCards.sort();
        let cards = this.chosenCards;
        let lastCardsInfo = this.lastCardsInfo;
        let nums = [];
        for (let c of cards) {
          let n = c.substring(0, 1);
          switch (n) {
            case "I":
              nums.push(10);
              break;
            case "J":
              nums.push(11);
              break;
            case "Q":
              nums.push(12);
              break;
            case "R":
              nums.push(13);
              break;
            default:
              nums.push(parseInt(n));
              break;
          }
        }
        switch (cards.length) {
          case 1:
            this.chosenCardInfo.type = "single";
            this.chosenCardInfo.value = cards[0];
            break;
          case 2:
            if (nums[0] == nums[1]) {
              this.chosenCardInfo.type = "pair";
              this.chosenCardInfo.value = cards[1];
            };
            break;
          case 5:
            let check = {
              seq: []
            };
            for (let i = 0; i < 4; i++) {
              let m = nums[i + 1] - nums[i];
              check.seq.push(m);
              if (check[m] == undefined) {
                check[m] = 0;
              }
              check[m]++;
            }
            if (check[0] == 3) {
              let vm = this;
              check.seq.forEach((element, index) => {
                if (element != 0) {
                  switch (index) {
                    case 0:
                      vm.chosenCardInfo.type = "fourOfKind";
                      vm.chosenCardInfo.value = nums[1];
                      break;
                    case 1:
                      vm.chosenCardInfo.type = "fullHouse";
                      vm.chosenCardInfo.value = nums[2];
                      break;
                    case 2:
                      vm.chosenCardInfo.type = "fullHouse";
                      vm.chosenCardInfo.value = nums[0];
                      break;
                    case 3:
                      vm.chosenCardInfo.type = "fourOfKind";
                      vm.chosenCardInfo.value = nums[0];
                      break;
                  };
                };
              })
            } else if (check[1] == 4) {
              if (this.checkFlower(cards)) {
                this.chosenCardInfo.type = "straightFlush";
                this.chosenCardInfo.value = cards[0];
              } else {
                this.chosenCardInfo.type = "straight";
                this.chosenCardInfo.value = cards[0];
              }
            } else if (this.arraysEqual(nums, [1, 10, 11, 12, 13])) {
              this.chosenCardInfo.type = "straight";
              this.chosenCardInfo.value = cards[1];
              let temp = cards.slice(0, 1);
              cards.splice(0, 1);
              cards.push(temp[0]);
            };
            break;
        }
      },
      checkFlower(cards) {
        cards = cards.map(x => x.substring(1, 2));
        for (let i = 0; i < cards.length - 1; i++) {
          if (cards[i] != cards[i + 1]) {
            return false;
          };
        }
        return true;
      },
      arraysEqual(a, b) {
        for (let i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      },
      valueCompare(a, b) {
        let ret = false;
        if (typeof(a) == typeof(b)) {
          let array = [a, b];
          let num = [];
          let temp;
          for (let element of array) {
            if (typeof(a) == "string") {
              temp = element.substring(0, 1);
            } else {
              temp = element;
            }
            switch (temp) {
              case "I":
                num.push(10);
                break;
              case "J":
                num.push(11);
                break;
              case "Q":
                num.push(12);
                break;
              case "R":
                num.push(13);
                break;
              default:
                num.push(parseInt(temp));
                break;
            }
          }
          if (num[0] == num[1]) {
            if (a > b) {
              ret = true
            }
          } else {
            switch (num[0]) {
              case 1:
                if (num[1] != 2) {
                  ret = true;
                }
                break;
              case 2:
                ret = true;
                break;
              default:
                if (num[1] != 1 && num[1] != 2 && num[0] > num[1]) {
                  ret = true;
                }
                break;
            };
          }
        }
        return ret;
      },
      resizeCardWidth() {
        let height = this.$refs.cardPlace.clientHeight - 2;
        let width = this.$refs.cardPlace.clientWidth + 2;
        let cardWidth = height * 0.9 * (691 / 1056);
        this.cardWidthPer = (cardWidth / width) * 100;
        this.showCardWidthPer = ((cardWidth + 2) / width * 0.75) * 100;
      }
    },
    sockets: {
      dealCard(ret) {
        this.playerOrder = ret.playerOrder;
        this.cards = ret.cards;
      },
      updatePlayerList(playerList) {
        this.playerList = playerList;
      },
      start(first) {
        this.isStart = true;
        this.resizeCardWidth();
        let vm = this;
        window.addEventListener('resize', vm.resizeCardWidth);
        this.yourTurn = first;
      },
      updateCard(cards) {
        this.yourTurn = cards.nextPlayer;
        this.showCards = cards.cards;
        this.lastCardsInfo = cards.cardsInfo;
      },
      lastPass(player) {
        this.yourTurn = player.nextPlayer;
        if (player.allPass) {
          this.allPass = true;
        }
      },
      otherWin(player) {
        alert(`Player ${player} win!`);
      }
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  #container {
    height: 100%;
  }
  #table {
    width: 100%;
    height: 100%;
  }
  #table div {
    border: 1px solid black;
  }
  .note {
    position: fixed;
  }
  .left,
  .center,
  .right {
    float: left;
    height: 100%;
  }
  #top {
    height: 23%;
  }
  #middle {
    height: 50%;
  }
  #middle .center {
    position: relative;
  }
  #middle .center img {
    position: absolute;
    top: 25%;
    height: 48.6%;
  }
  #bottom {
    height: 27%;
  }
  #bottom .center {
    position: relative;
  }
  #bottom .center img {
    position: absolute;
    top: 5%;
    height: 90%;
  }
  #bottom .button {
    position: relative;
    top: 15%;
    height: 70%;
  }
</style>
