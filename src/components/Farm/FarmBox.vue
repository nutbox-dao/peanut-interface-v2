<template>
  <div class="stake">
    <Card>
      <div class="stake-box">
        <div class="title">
          <img :src="logo[symbol]" alt="" />
          <span>
            {{ title[symbol] }}
          </span>
        </div>
        <div class="pending-box">
          <p>
            {{ $t("message.pnutprofits") }}
          </p>
          <div>
            <span>
              {{ pendingPnut | amountForm }}
            </span>
            <b-button variant="primary" @click="withdrawPnut">
              {{ $t("message.withdraw") }}
            </b-button>
          </div>
        </div>
        <div class="op-box">
          <p>
            {{ depositedDesc[symbol] }}
          </p>

          <ConnectWalletBtn
            v-if="!isConnected"
            @tronLogin="showTronLinkInfo"
            type="TRON"
          />
          <div v-if="!approved[symbol]">
            <b-button variant="primary" @click="approveContract">
              {{ $t("message.approveContract") }}
            </b-button>
          </div>
          <div v-if="!deposited && isConnected && approved[symbol]">
            <span> 0 </span>
            <b-button @click="addDeposit">
              {{ $t("stake.stake") }}
            </b-button>
          </div>
          <div v-if="deposited && isConnected && approved[symbol]">
            <span>0</span>
            <button @click="minusDeposit">-</button>
            <button @click="addDeposit">+</button>
          </div>
        </div>
      </div>
      <!--手续费-->
      <p class="fee">
        <span>APY</span>
        <span>{{ apy }}</span>
      </p>

      <p class="fee">
        <span>
          {{ totalDepositedDesc[symbol] }}
        </span>
        <span>
          {{ totalDeposited[symbol] | amountForm }}
        </span>
      </p>
    </Card>
    <ChangeDepositMask
      :operate="operate"
      v-if="showChangeDepositMask"
      @hideMask="showChangeDepositMask = false"
    />
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
  </div>
</template>

<script>
import Card from "../ToolsComponents/Card";
import TipMessage from "../ToolsComponents/TipMessage";
import ChangeDepositeMask from "./ChangeDepositeMask";
import { getContract, approveContract } from "../../utils/chain/contract";
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";

import {
  intToAmount,
  isTransactionSuccess,
  isInsufficientEnerge,
  getTronLinkAddr,
} from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { TRON_CONTRACT_CALL_PARAMS } from "../../config";

export default {
  name: "FarmBox",
  components: {
    Card,
    TipMessage,
    ChangeDepositeMask,
    ConnectWalletBtn,
  },
  data() {
    return {
      approved: {},
      saveApproveMethod: {},
      tokenBalance: {},
      depositeBalance: {},
      totalDeposited: {},
      title: {},
      depositedDesc: {},
      totalDepositedDesc: {},
      logo: {},
      tspPendingPnut: 0,
      tspLpPendingPnut: 0,
      pnutLpPendingPnut: 0,
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      showChangeDepositMask: false,
      isLoading: false,
      isApproving: false,
      isWithdrawing: false,
    };
  },
  props: {
    symbol: {
      type: String,
      default: "TSP_LP_POOL",
    },
  },
  computed: {
    ...mapState([
      "tronAddress",
      "pnutLpBalanceInt",
      "depositedPnutLpInt",
      "pnutBalanceInt",
      "tspBalanceInt",
      "depositedTspInt",
      "approvedTSP",
      "approvedTSPLP",
      "approvedPNUTLP",
      "apy",
    ]),
    ...mapGetters([
      "pnutLpBalance",
      "depositedPnutLp",
      "pnutBalance",
      "tspBalance",
      "depositedTsp",
      "tspLpBalance",
      "depositedTspLp",
      "totalDepositedTsp",
      "totalDepositedTspLp",
      "totalDepositedPnutLp",
    ]),
    isConnected() {
      return this.tronAddress && this.tronAddress.length > 0;
    },
    deposited() {
      return this.depositeBalance[this.symbol] > 0;
    },
    pendingPnut() {
      if (this.symbol === "TSP_POOL") {
        return this.tspPendingPnut;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.tspLpPendingPnut;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.pnutLpPendingPnut;
      }
    },
  },
  methods: {
    ...mapActions([
      "getPnutLp",
      "getPnut",
      "getDepositedPnutLp",
      "getTsp",
      "getDepositedTsp",
      "getTotalDepositedTsp",
      "getTotalDepositedTspLp",
      "getTotalDepositedPnutLp",
      "getApprovedTSP",
      "getApprovedTSPLP",
      "getApprovedPNUTLP",
    ]),
    ...mapMutations([
      "savePnutLpBalanceInt",
      "saveDepositedPnutLpInt",
      "savePnutBalanceInt",
      "saveTspBalanceInt",
      "saveDepositedTspInt",
      "saveApprovedTSP",
      "saveApprovedTSPLP",
      "saveApprovedPNUTLP",
    ]),

    async approveContract() {
      this.isLoading = true;
      this.isApproving = true;
      try {
        const res = await approveContract(this.symbol);
        if (res === 0) {
          this.saveApproveMethod[this.symbol](true);
        } else if (res === 1) {
          this.showTip(this.$t("error.error"), this.$t("error.approveFail"));
        } else {
          this.showTip(
            this.$t("error.error"),
            this.$t("error.insufficientEnerge")
          );
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isLoading = false;
        this.isApproving = false;
      }
    },
    
    minusDeposit() {},
    addDeposit() {},
    withdrawPnut() {},
    async showTronLinkInfo() {
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
        store.dispatch("initializeTronAccount", address);
      }
    },
    async getPendingPeanut() {
      try {
        const contract = await getContract(this.symbol);
        if (!contract) return;
        const s = await contract.getPendingPeanuts().call();
        const pnut = intToAmount(s);
        if (this.symbol === "TSP_POOL") {
          this.tspPendingPnut = pnut;
          console.log(2134, pnut);
        } else if (this.symbol === "TSP_LP_POOL") {
          this.tspLpPendingPnut = pnut;
        } else if (this.symbol === "PNUT_LP_POOL") {
          this.pnutLpPendingPnut = pnut;
        }
      } catch (e) {
        //   console.log(234,e);
      }
    },
    showTip(title, message) {
      this.tipTitle = title;
      this.tipMessage = message;
      this.showMessage = true;
    },
  },
  mounted() {
    this.logo = {
      TSP_POOL:
        "https://coin.top/production/upload/logo/TW2EWoRUJfwH9nMTfLxSL9JPLZeusUtTfR.jpeg?t=1608343575484",
      TSP_LP_POOL:
        "https://coin.top/production/upload/logo/TBpTbddofiBrE1AfhQbwU2BhsrBUM2Lnir.png?t=1609305241285",
      PNUT_LP_POOL:
        "https://coin.top/production/logo/TPt2a3GtKMY5972mWa2aL3KKVY6ScWX2G2.jpg",
    };
    this.title = {
      TSP_POOL: "TSP STAKE",
      TSP_LP_POOL: "TSP-TRX LP",
      PNUT_LP_POOL: "PNUT-TRX LP",
    };
    this.depositedDesc = {
      TSP_POOL: this.$t("farm.tsp.yourTspAmount"),
      TSP_LP_POOL: this.$t("farm.tspLp.yourTSPLPAmount"),
      PNUT_LP_POOL: this.$t("farm.pnutLp.yourPNUTLPAmount"),
    };
    this.depositeBalance = {
      TSP_POOL: this.depositedTsp,
      TSP_LP_POOL: this.approvedTSPLP,
      PNUT_LP_POOL: this.approvedPNUTLP,
    };
    this.approved = {
      TSP_POOL: this.approvedTSP,
      TSP_LP_POOL: this.approvedTSPLP,
      PNUT_LP_POOL: this.approvedPNUTLP,
    };
    this.totalDepositedDesc = {
      TSP_POOL: this.$t("farm.tsp.totalDepositTsp"),
      TSP_LP_POOL: this.$t("farm.tspLp.totalDepositTspLP"),
      PNUT_LP_POOL: this.$t("farm.pnutLp.totalDepositPnutLP"),
    };
    this.saveApproveMethod = {
      TSP_POOL: this.saveApprovedTSP,
      TSP_LP_POOL: this.saveApprovedTSPLP,
      PNUT_LP_POOL: this.saveApprovedPNUTLP,
    };
    if (this.tronAddress && this.tronAddress.length > 0) {
      // 设置定时器以更新当前收益
      const timer = setInterval(this.getPendingPeanut, 3000);
      // 通过$once来监听定时器，在beforeDestroy钩子时被清除。
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../static/css/stake.less";
</style>
