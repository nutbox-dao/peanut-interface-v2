<template>
      <div class="farm">
        <h3>
            {{ this.$t('farm.farm') }}
        </h3>
        <div class="nav">
        </div>
        <div class="farm-box">
            <FarmBox symbol="PNUT_LP_POOL"/>
            <FarmBox symbol="TSP_LP_POOL"/>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import FarmBox from './FarmBox'
export default {
  name: 'Farm',
  components: {
      FarmBox,
  },
  data () {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.farm{
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
    .farm-box{
        display:flex;
        align-content: left;
        flex-wrap: wrap;
        justify-content:space-between
    }

}
</style>
