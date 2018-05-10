<template>
  <div id="container">
    <div id="table">
      <div id="top">
        <span class="note">top</span>
        <div style="width:30%; " class="left">
        </div>
        <div style="width:40%" class="center">
        </div>
        <div style="width:30%" class="right">
        </div>
      </div>
      <div id="middle">
        <span class="note">middle</span>
        <div style="width:20%" class="left">
        </div>
        <div style="width:60%" class="center">
          {{chosenCards}}
        </div>
        <div style="width:20%" class="right">
        </div>
      </div>
      <div id="bottom">
        <span class="note">bottom</span>
        <div style="width:10%" class="left">
        </div>
        <div ref="cardPlace" style="width:80%" class="center">
          <img ref="card" @mousedown="chooseCard(index)" :style="`left:${((96-cardWidthPer)/12)*index+2+(13-cards.length)*((cardWidthPer-(cardWidthPer-(96-cardWidthPer)/12))/2)}%;`" v-for="(card,index) in cards" :src="`/static/cards/${card}.jpg`" />
        </div>
        <div style="width:10%" class="right">
          <div class="button">
            <button @click="test([0])">出牌</button>
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
        cards: ['AC', '2C', '3C', '4C', '5C', '6C','7C','8C','9C'],
        cardWidthPer: 0,
        chosenCards: []
      }
    },
    computed: {},
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
          console.log(this.$refs);
        }
      },
      resizeCardWidth() {
        let height = this.$refs.cardPlace.clientHeight-2;
        let width = this.$refs.cardPlace.clientWidth+2;
        this.cardWidthPer = (height * 0.9 * (691/1056) / width)*100;
        console.log(height * 0.9 * (691/1056));
      }
    },
    mounted() {
      console.log(100/13);
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
