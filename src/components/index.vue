<template>
  <div id="container">
    <div id="table">
      <div id="top">
        <span class="note">top</span>
        <div style="width:30%; " class="left">
        </div>
        <div style="width:40%" class="center">
          {{cards}}<br> {{chosenCards}} <br>
        </div>
        <div style="width:30%" class="right">
        </div>
      </div>
      <div id="middle">
        <span class="note">middle</span>
        <div style="width:20%" class="left">
        </div>
        <div style="width:60%" class="center">
          <img ref="showCard" :style="`left:${(100-showCardWidthPer)/10*index+(100-(showCards.length-1)*((100-showCardWidthPer)/10)-showCardWidthPer)/2}%;`" v-for="(card,index) in showCards" :src="`/static/cards/${card}.jpg`" />
        </div>
        <div style="width:20%" class="right">
        </div>
      </div>
      <div id="bottom">
        <span class="note">bottom</span>
        <div style="width:10%" class="left">
        </div>
        <div ref="cardPlace" style="width:80%" class="center">
          <img ref="card" @mousedown="chooseCard(index)" :style="`left:${((96-cardWidthPer)/12)*index+2+(13-cards.length)*((96-cardWidthPer)/12/2)}%;`" v-for="(card,index) in sortCards" :src="`/static/cards/${card}.jpg`" />
        </div>
        <div style="width:10%" class="right">
          <div class="button">
            <button @click="playCard">出牌</button>
            <button>Pass</button>
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
        allCards: [],
        cards: ['3H', '9D', '3C', '2C', '2D', '6H', '7C', '8C', '9C', 'IC', 'QC'],
        cardWidthPer: 0,
        showCardWidthPer: 0,
        chosenCards: [],
        showCards: []
      }
    },
    computed: {
      sortCards() {
        return this.cards.sort();
      }
    },
    methods: {
      chooseCard(index) {
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
      },
      playCard() {
        this.showCards = this.chosenCards.sort();
        for (let element of this.chosenCards) {
          let index = this.cards.indexOf(element);
          this.cards.splice(index, 1);
        }
        for (let i = 0; i < this.cards.length; i++) {
          this.$refs.card[i].style.top = "5%";
          this.$refs.card[i].style.border = "";
          this.$refs.card[i].style.borderRadius = "";
        }
        this.chosenCards = [];
      },
      resizeCardWidth() {
        let height = this.$refs.cardPlace.clientHeight - 2;
        let width = this.$refs.cardPlace.clientWidth + 2;
        let cardWidth = height * 0.9 * (691 / 1056);
        this.cardWidthPer = (cardWidth / width) * 100;
        console.log(cardWidth + 2)
        this.showCardWidthPer = ((cardWidth + 2) / width * 0.75) * 100;
      }
    },
    mounted() {
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
          this.allCards.push(n + type);
        };
      }
      console.log(this.allCards);
      let vm = this;
      this.$nextTick(() => {
        vm.resizeCardWidth();
        window.addEventListener('resize', vm.resizeCardWidth);
      })
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
