<template>
  <div id="app">
    <div class="left">
      <img src="./static/images/logo.svg" alt="nutbox" class="logo">
      <b-nav pills vertical align="center">
        <b-nav-item to="/wallet">
          <b-icon icon="nut"></b-icon>
          {{ (tronAddrFromat && tronAddrFromat.length > 0) ? tronAddrFromat : $t('wallet.wallet') }}
        </b-nav-item>
        <b-nav-item to="/stake">
          <b-icon icon="nut"></b-icon>
          {{ $t('stake.stake') }}
        </b-nav-item>
        <b-nav-item to="/farm">
          <b-icon icon="nut"></b-icon>
          {{ $t('farm.farm') }}
        </b-nav-item>
        <div class="bottom">
          <a href="/wallet" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
          <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
           <a href="/stake" target="_blank">
            <b-icon icon="nut"></b-icon>
          </a>
        </div>
      </b-nav>
    </div>
    <TipMessage :showMessage='tipMessage' :title="tipTitle" v-if="showMessage" @hideMask="showMessage=false"/>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { watchWallet, getTronLinkAddr } from './utils/chain/tron'
import { TRON_LINK_ADDR_NOT_FOUND } from './config'
import TipMessage from './components/ToolsComponents/TipMessage'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      tipMessage: '',
      tipTitle: '',
      showMessage: false
    }
  },
  computed: {
    ...mapState(['tronAddress']),
    ...mapGetters(['tronAddrFromat'])
  },
  components: {
    TipMessage
  },
  async mounted () {
    this.$store.dispatch('setVestsToSteem')
    var store = this.$store
    const address = await getTronLinkAddr()
    if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
      this.tipTitle = this.$t('error.needtronlink')
      this.tipMessage = 'TronLink: https://www.tronlink.org'
      this.showMessage = true
    } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
      this.tipTitle = this.$t('error.error')
      this.tipMessage = this.$t('error.unlockWallet')
      this.showMessage = true
    } else if (address) {
      this.$store.dispatch('initializeTronAccount', address)
    }
    watchWallet((address) => {
      if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
        this.tipTitle = this.$t('error.needtronlink')
        this.tipMessage = 'TronLink: https://www.tronlink.org'
        this.showMessage = true
      } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
        this.tipTitle = this.$t('error.error')
        this.tipMessage = this.$t('error.unlockWallet')
        this.showMessage = true
      } else if (address) {
        store.dispatch('initializeTronAccount', address)
      }
    })
  }
}
</script>

<style lang="scss">
$blue: #f4a921;
:root{
  --yellow-background: #f5ecd8;
  --primary: #f4a921;
}

@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
html, body{
  height:100%;
  margin:0;
}
#app {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  align-items: left;
}
h3{
    margin-top: 64px;
    text-align: left;
    display: block;
    width: 100%;
}

.logo {
  margin-bottom:30px
}

.left{
  background-color: #fefefe;
  padding-top: 64px;
  width: 240px;
  position: relative;
  box-shadow:0 0 16px #eee;
}
.right{
  background-color:#fefefa;
  flex: 1
}

.left .nav-item{
  height: 60px;
  font-size: 1.1rem;
  text-align: left;
  box-sizing: border-box;
}

.left .nav-item:hover{
  background-color: var(--yellow-background) !important;
}

.left .nav-item .b-icon{
  margin-right: 6px;
}

.left .nav-link{
  height:100%;
  line-height:44px;
  color:var(--primary) !important;
  padding-left: 24px;
}

.left .active{
  background-color:var(--yellow-background) !important;
  border-radius: 0px;
}

.left .bottom{
  position:absolute;
  padding:0 40px;
  width: 100%;
  bottom:30px;
  background-color:#fefefe;
  display:flex;
  justify-content:center;
  justify-content:space-around;
}
.left .bottom a{
  font-size: 1.2rem !important;
}

</style>
