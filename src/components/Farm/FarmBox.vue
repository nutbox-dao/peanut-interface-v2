<template>
  <div class="stake">
    <Card>
      <div class="title-box">
        <img :src="logo[symbol]" alt="" />
        <span class="title">
          {{ title[symbol] }}
        </span>
      </div>
      <div class="pending-box">
        <p class="info-title">
          <span class="info-token">PNUT</span>
          <span class="info-desc">EARNED</span>
        </p>
        <div class="pending-input">
          <span :class="pendingPnut > 0 ? 'token-number' : 'token-number-none'">
            {{ pendingPnut | amountForm }}
          </span>
          <b-button
            variant="primary"
            @click="withdrawPnut"
            :disabled="pendingPnut <= 0 || isLoading"
          >
            <b-spinner small type="grow" v-show="isLoading"></b-spinner>
            {{ $t("message.withdraw") }}
          </b-button>
        </div>
      </div>
      <div class="op-box">
        <p class="info-title">
          <span class="info-token">{{ token[symbol] }}</span>
          <span class="info-desc">STAKED</span>
        </p>

        <ConnectWalletBtn
          class="op-bottom"
          v-if="!isConnected"
          @tronLogin="showTronLinkInfo"
          type="TRON"
        />
        <div class="op-bottom" v-if="!approved">
          <b-button
            variant="primary"
            @click="approveContract"
            :disabled="isLoading"
            style="width: 272px"
          >
            {{ $t("message.approveContract") }}
          </b-button>
        </div>
        <div class="op-bottom" v-if="!deposited && isConnected && approved">
          <span class="token-number-none"> 0 </span>
          <b-button variant="primary" @click="addDeposit" :disabled="isLoading">
            {{ $t("stake.stake") }}
          </b-button>
        </div>
        <div class="op-bottom" v-if="deposited && isConnected && approved">
          <span
            :class="depositedBalance > 0 ? 'token-number' : 'token-number-none'"
            >{{ depositedBalance | amountForm }}</span
          >
          <div>
            <button
              class="minus-btn op-btn"
              @click="minusDeposit"
              :disabled="isLoading"
            >
              -
            </button>
            <button class="op-btn" @click="addDeposit" :disabled="isLoading">
              +
            </button>
          </div>
        </div>
      </div>
      <!--手续费-->
      <p class="fee apy">
        <span>APY</span>
        <span>{{ apy }}</span>
      </p>

      <p class="fee">
        <span>
          {{ totalDepositedDesc[symbol] }}
        </span>
        <span>
          {{ totalDeposited | amountForm }}
        </span>
      </p>
    </Card>
    <ChangeDepositMask
      :isAddStake="isAddStake"
      v-if="showChangeDepositMask"
      @hideMask="showChangeDepositMask = false"
      :symbol="symbol"
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
import ChangeDepositMask from "./ChangeDepositMask";
import { approveContract, getContract } from "../../utils/chain/contract";
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";

import {
  intToAmount,
  amountToInt,
  isTransactionSuccess,
  isInsufficientEnerge,
  getTronLinkAddr,
} from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  TRON_CONTRACT_CALL_PARAMS,
  TRON_LINK_ADDR_NOT_FOUND,
} from "../../config";

export default {
  name: "FarmBox",
  components: {
    Card,
    TipMessage,
    ChangeDepositMask,
    ConnectWalletBtn,
  },
  data() {
    return {
      saveApproveMethod: {},
      title: {},
      depositedDesc: {},
      totalDepositedDesc: {},
      logo: {},
      token: {},
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
      isAddStake: true,
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
      "approvedTsp",
      "approvedTspLp",
      "approvedPnutLp",
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
    depositedBalance() {
      if (this.symbol === "TSP_POOL") {
        return this.depositedTsp;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.depositedTspLp;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.depositedPnutLp;
      }
    },
    deposited() {
      if (this.symbol === "TSP_POOL") {
        return this.depositedTsp > 0;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.depositedTspLp > 0;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.depositedPnutLp > 0;
      }
    },
    totalDeposited() {
      if (this.symbol === "TSP_POOL") {
        return this.totalDepositedTsp;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.totalDepositedTspLp;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.totalDepositedPnutLp;
      }
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
    approved() {
      if (this.symbol === "TSP_POOL") {
        return this.approvedTsp;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.approvedTspLp;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.approvedPnutLp;
      }
    },
  },
  methods: {
    ...mapActions([
      "getPnut",
      "getTsp",
      "getDepositedTsp",
      "getTspLp",
      "getDepositedTspLp",
      "getPnutLp",
      "getDepositedPnutLp",
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
        console.log(2314, res);
        if (res === 0) {
          this.saveApproveMethod[this.symbol](true);
        } else if (res === 1) {
          console.log("1");
          this.showTip(this.$t("error.error"), this.$t("error.approveFail"));
        } else {
          this.showTip(
            this.$t("error.error"),
            this.$t("error.insufficientEnerge")
          );
        }
      } catch (e) {
        console.log("error");
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        console.log("over");
        this.isLoading = false;
        this.isApproving = false;
      }
    },
    minusDeposit() {
      this.isAddStake = false;
      this.showChangeDepositMask = true;
    },
    addDeposit() {
      this.isAddStake = true;
      this.showChangeDepositMask = true;
    },
    async withdrawPnut() {
      try {
        this.isLoading = true;
        this.isWithdrawing = true;
        const contract = await getContract(this.symbol);
        const res = await contract
          .withdrawPeanuts()
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.savePnutBalanceInt(
            this.pnutBalanceInt - amountToInt(-parseFloat(this.pendingPnut))
          );
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(this.$t("error.error"), this.$t("error.withdrawFail"));
          }
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isLoading = false;
        this.isWithdrawing = false;
      }
    },

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
        this.$store.dispatch("initializeTronAccount", address);
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

    (this.token = {
      TSP_POOL: "TSP",
      TSP_LP_POOL: "S-TSP-TRX",
      PNUT_LP_POOL: "S-PNUT-TRX",
    }),
      (this.depositedDesc = {
        TSP_POOL: this.$t("farm.tsp.yourTspAmount"),
        TSP_LP_POOL: this.$t("farm.tspLp.yourTSPLPAmount"),
        PNUT_LP_POOL: this.$t("farm.pnutLp.yourPNUTLPAmount"),
      });
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
      // 获取最新的数据
      if (this.symbol === "TSP_POOL") {
        this.getTsp();
        this.getDepositedTsp();
        this.getTotalDepositedTsp();
        this.getApprovedTSP();
      } else if (this.symbol === "TSP_LP_POOL") {
        this.getTspLp();
        this.getDepositedTspLp();
        this.getTotalDepositedTspLp();
        this.getApprovedTSPLP();
      } else if (this.symbol === "PNUT_LP_POOL") {
        this.getPnutLp();
        this.getDepositedPnutLp();
        this.getTotalDepositedPnutLp();
        this.getApprovedPNUTLP();
      }
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
