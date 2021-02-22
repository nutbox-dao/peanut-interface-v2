<template>
  <div>
    <b-button class='login-btn' variant="primary" @click="unlock" v-if="type=='STEEM' ? (!steemAccount || steemAccount.length === 0) : (!tronAddress || tronAddress.length === 0)">
      <!-- <b-button variant="primary" @click="unlock"> -->
      {{
        type == "STEEM" ? $t("wallet.connectSteem") : $t("wallet.connectTron")
      }}
    </b-button>
    <Login v-if="showSteemLogin" @hideMask="showSteemLogin = false"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Login from '../Login'

export default {
  name: "ConnectWalletBtn",
  data() {
      return {
          showSteemLogin: false,
          showTronLogin:false,
      }
  },
  props: {
    type: {
      type: String,
      default: "STEEM",
    },
  },
  components: {
      Login
  },
  computed: {
      ...mapState(['steemAccount','tronAddress'])
  },
  methods: {
      unlock() {
          if (this.type === "STEEM"){
              this.showSteemLogin = true
          }else{
              this.showTronLogin = true
          }
      }
  },
};
</script>

<style lang="scss" scoped>
button {
    margin-top: 16px;
    width: 90%;
    height: 40px;
}
</style>