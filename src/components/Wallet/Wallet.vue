<template>
    <div class="wallet">
        <h3>
            {{ this.$t('wallet.wallet') }}
        </h3>
        <div class="nav">
            <router-link to='/wallet' exact>Steem</router-link>
            <router-link to='/wallet/tron'>Tron</router-link>
            <router-link to='swap'>{{this.$t('wallet.swap')}}</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'Wallet',
  data () {
    return {

    }
  },
  methods: {
  },
  mounted () {
    ;
  }
}
</script>

<style lang="less" scoped>
.wallet{
    padding: 0px 40px 64px;
    > h3{
        margin-top: 64px;
        text-align: left;
    }
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
