<template>
  <div class="connect-wallet">
    <b-button class='login-btn' variant="primary" @click="unlock" v-if="type=='STEEM' ? (!steemAccount || steemAccount.length === 0) : (!tronAddress || tronAddress.length === 0)">
      <!-- <b-button variant="primary" @click="unlock"> -->
      {{
        type == "STEEM" ? $t("wallet.connectSteem") : $t("wallet.connectTron")
      }}
    </b-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "ConnectWalletBtn",
  data() {
      return {
      }
  },
  props: {
    type: {
      type: String,
      default: "STEEM",
    },
  },
  computed: {
      ...mapState(['steemAccount','tronAddress'])
  },
  methods: {
      unlock() {
          if (this.type === "STEEM"){
              this.$emit('steemLogin')
          }else{
              this.$emit('tronLogin')
          }
      }
  },
};
</script>

<style lang="scss" scoped>
.connect-wallet{
    z-index: 999;
}
button {
    margin-top: 24px;
    width: 272px;
    height: 48px;
}
</style>