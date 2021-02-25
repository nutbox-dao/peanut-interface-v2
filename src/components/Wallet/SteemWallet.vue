<template>
  <div class="steem-wallet">
    <div class="steem-wallet">
      <!-- 用户名 -->
      <b-dropdown
      v-if="steemAccount && steemAccount.trim().length > 0"
        :text="steemAccount"
        size="lg"
        lazy
        block
        variant="outline-primary"
        menu-class="w-100"
      >
        <b-dropdown-item-btn @click="logout" size="lg" variant="primary">{{
          $t("message.logout")
        }}</b-dropdown-item-btn>
      </b-dropdown>
      <div class="balance-box">
        <BalanceView
          name="STEEM"
          :balances="steemBalance+''"
          desc="STEEM"
          :logo="steemLogo"
          walletType="STEEM"
        />
        <BalanceView
          name="SP"
          :balances="spBalance+''"
          desc="STEEM POWER"
          :logo="spLogo"
          walletType="STEEM"
        />
        <BalanceView
          name="SBD"
          :balances="sbdBalance+''"
          desc="STEEM DOLLAR"
          :logo="sbdLogo"
          walletType="STEEM"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getKeychain } from "../../utils/chain/steem";
import BalanceView from "./BalanceView";

export default {
  name: "SteemWallet",
  data() {
    return {
      steemLogo: require("../../static/images/steem.svg"),
      sbdLogo: require("../../static/images/sbd.svg"),
      spLogo: require("../../static/images/tsp.svg")
    };
  },
  computed: {
    ...mapState(["steemAccount", "steemBalance", "sbdBalance"]),
    ...mapGetters(["spBalance"]),
  },
  methods: {
    async changeAccount(account) {
      this.$store.commit("saveSteemAccount", account);
      console.log(account);
    },
    logout() {
      this.$store.commit("clearSteemAccount");
      
    },
  },
  components: {
    BalanceView,
  },
  async mounted() {
    if (!(await getKeychain())) {
      const link =
        "Chrome: https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm\n\n" +
        "Firefox: https://addons.mozilla.org/en-US/firefox/addon/steem-keychain";
      this.tipTitle = this.$t("error.needkeychain");
      this.tipMessage = link;
      this.showMessage = true;
    } else {
      if (this.steemAccount && this.steemAccount.trim().length > 0) {
        this.$store.dispatch("initializeSteemAccount", this.steemAccount);
      }
    }
  },
};
</script>

<style lang="less" scoped>
.steem-wallet {
  margin-top: 20px;
  .balance-box {
    display: flex;
    align-content: left;
    // z-index: 1;
    // justify-content: space-between;
    flex-wrap: wrap;
    >div{
      margin-top: 24px;
      margin-right: 24px;
    }
  }
}
</style>
