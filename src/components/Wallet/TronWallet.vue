<template>
  <div class="tron">
    <div class="balance-box">
      <BalanceView
        name="TRON"
        desc="TRON"
        :balances="tronBalance"
        :logo="tronLogo"
        walletType="TRON"
      />
      <BalanceView
        name="PNUT"
        desc="Nutbox Peanut"
        :balances="pnutBalance"
        :logo="pnutLogo"
        walletType="TRON"
      />
      <BalanceView
        name="TSP"
        desc="Nutbox TSP"
        :balances="tspBalance"
        :logo="tspLogo"
        walletType="TRON"
      />
      <BalanceView
        name="TSBD"
        desc="Nutbox TSBD"
        :balances="tsbdBalance"
        :logo="tsbdLogo"
        walletType="TRON"
      />
      <BalanceView
        name="TSTEEM"
        desc="Nutbox TSTEEM"
        :balances="tsteemBalance"
        :logo="tsteemLogo"
        walletType="TRON"
      />
      <BalanceView
        name="TSP-TRX LP"
        desc="S-TSP-TRX"
        :balances="tspLpBalance"
        :logo="tspLpLogo"
        walletType="TRON"
      />
      <BalanceView
        name="PNUT-TRX LP"
        desc="S-PNUT-TRX"
        :balances="pnutLpBalance"
        :logo="pnutLpLogo"
        walletType="TRON"
      />
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
  </div>
</template>

<script>
import TipMessage from "../ToolsComponents/TipMessage";
import BalanceView from "./BalanceView";
import { mapActions, mapState, mapGetters } from "vuex";
import { getTronLinkAddr } from "../../utils/chain/tron";
import { TRON_LINK_ADDR_NOT_FOUND } from "../../config";

export default {
  name: "TronWallet",

  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      tronLogo: "https://coin.top/production/logo/trx.png",
      pnutLogo:"https://coin.top/production/upload/logo/TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW.jpeg?t=1603183073762",
      tsteemLogo: "https://coin.top/production/upload/logo/TBUZYrDh7gzjd1PLnkMHWoAo55ctRzZzGN.jpeg?t=1603158036125",
      tsbdLogo: "https://coin.top/production/upload/logo/TEPZJmYLJxJc8b5FueswwLWmUDhJGnih6Q.jpeg?t=1603160965252",
      tspLogo: "https://coin.top/production/upload/logo/TW2EWoRUJfwH9nMTfLxSL9JPLZeusUtTfR.jpeg?t=1608343575484",
      tspLpLogo: "https://coin.top/production/upload/logo/TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir.png?t=1609305241285",
      pnutLpLogo:"https://coin.top/production/logo/TPt2a3GtKMY5972mWa2aL3KKVY6ScWX2G2.jpg",
    };
  },

  computed: {
    ...mapState(["tronAddress"]),
    ...mapGetters([
      "tronBalance",
      "pnutBalance",
      "tsteemBalance",
      "tspBalance",
      "tsbdBalance",
      "tspLpBalance",
      "pnutLpBalance",
    ]),
  },

  components: {
    TipMessage,
    BalanceView,
  },

  methods: {
    ...mapActions(["initializeTronAccount"]),
  },

  async mounted() {
    const address = await getTronLinkAddr();
    if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
      this.tipTitle = this.$t("error.needtronlink");
      this.tipMessage = "TronLink: https://www.tronlink.org";
      this.showMessage = true;
    } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
      this.tipTitle = this.$t("error.error");
      this.tipMessage = this.$t("error.unlockWallet");
      this.showMessage = true;
    } else if (address) {
      this.initializeTronAccount(address);
    }
  },
};
</script>

<style lang="less" scoped>
.tron {
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
