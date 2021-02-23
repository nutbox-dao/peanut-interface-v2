<template>
      <div id="stake">
        <h3>
            {{ this.$t('stake.stake') }}
        </h3>
        <div class="nav">
        </div>
        <div class="stake-box">
            <SPPool/>
            <FarmBox symbol="TSP_POOL"/>
        </div>
    </div>
</template>

<script>
import SPPool from "./SPPool"
import FarmBox from "../Farm/FarmBox"

export default {
  name: 'Stake',
  data () {
    return {

    }
  },
components: {
    SPPool,
    FarmBox
},
  methods: {
    tsp () {

    },
    tsplp () {

    }
  }
}
</script>

<style lang="less" scoped>
#stake{
    padding: 0px 40px 64px;
    .nav{
        display:flex;
        align-items: left;
        border-bottom:1px solid #ddd;
        a{
            border:0;
            font-size:20px;
            padding:10px 24px;
            margin-top:30px;
            color: #666;
            box-sizing: border-box;
        }
        a:hover{
            background-color:var(--yellow-background);
            text-decoration:none;
        }
        .active{
            color:var(--primary);
            border-bottom: 2px solid var(--primary);
        }
    }
    .stake-box{
        display:flex;
        flex-wrap:wrap;
        align-content:left;
    }

}
</style>
