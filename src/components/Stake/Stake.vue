<template>
      <div class="stake">
        <h3>
            {{ this.$t('stake.stake') }}
        </h3>
        <div class="nav">
            <router-link to='/stake/sppool'>SP</router-link>
            <router-link to='/stake/tsppool'>TSP</router-link>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'Stake',
  data () {
    return {

    }
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
.stake{
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

}
</style>
