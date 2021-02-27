<template>
  <transition name="fade">
    <div class="mask" @click.self="hideMask">
      <Card>
        <h5>{{ isAddStake ? "Stake Tokens" : "Unstake Tokens" }}</h5>
        <div class="input-box">
          <div class="input-title">
            <span>{{ isAddStake ? "Stake" : "Unstake" }}</span>
            <span
              >Balance:{{
                (isAddStake ? tokenBalance : stakedBalance) | amountForm
              }}</span
            >
          </div>
          <div class="input-area">
            <input placeholder="0" type="text" v-model="inputValue" />
            <b-button variant="primary" @click="fillMax">
              {{ $t("message.max") }}
            </b-button>
          </div>
        </div>
        <div class="bottom">
          <button @click="cancel">{{ $t("message.cancel") }}</button>
          <button @click="confirm">{{ $t("message.confirm") }}</button>
        </div>
      </Card>
      <TipMessage
        :showMessage="tipMessage"
        :title="tipTitle"
        v-if="showMessage"
        @hideMask="showMessage = false"
      />
    </div>
  </transition>
</template>

<script>
import Card from "../ToolsComponents/Card";
import TipMessage from "../ToolsComponents/TipMessage";

import {
  intToAmount,
  amountToInt,
  isTransactionSuccess,
  isInsufficientEnerge,
} from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { TRON_CONTRACT_CALL_PARAMS } from "../../config";
import { getContract } from "../../utils/chain/contract";
export default {
  name: "ChangeDepositMask",
  data() {
    return {
      isLoading: false,
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      inputValue: "",
      saveTokenMethod: {},
      saveStakedMethod: {},
      getTotalStakedMethod: {},
    };
  },
  components: {
    Card,
    TipMessage,
  },
  computed: {
    ...mapState([
      "tronAddress",
      "tspBalanceInt",
      "depositedTspInt",
      "tspLpBalanceInt",
      "depositedTspLpInt",
      "pnutLpBalanceInt",
      "depositedPnutLpInt",
    ]),
    ...mapGetters([
      "tspBalance",
      "depositedTsp",
      "tspLpBalance",
      "depositedTspLp",
      "pnutLpBalance",
      "depositedPnutLp",
    ]),

    tokenBalance() {
      if (this.symbol === "TSP_POOL") {
        return this.tspBalance;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.tspLpBalance;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.pnutLpBalance;
      }
    },
    stakedBalance() {
      if (this.symbol === "TSP_POOL") {
        return this.depositedTsp;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.depositedTspLp;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.depositedPnutLp;
      }
    },
    tokenBalanceInt() {
      if (this.symbol === "TSP_POOL") {
        return this.tspBalanceInt;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.tspLpBalanceInt;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.pnutLpBalanceInt;
      }
    },
    stakedBalanceInt() {
      if (this.symbol === "TSP_POOL") {
        return this.depositedTspInt;
      } else if (this.symbol === "TSP_LP_POOL") {
        return this.depositedTspLpInt;
      } else if (this.symbol === "PNUT_LP_POOL") {
        return this.depositedPnutLpInt;
      }
    },
  },
  props: {
    isAddStake: {
      type: Boolean,
      default: true,
    },
    symbol: {
      type: String,
      default: "TSP_POOL",
    },
  },
  methods: {
    ...mapActions(["getTsp", "getDepositedTsp", "getPnut",
      "getTotalDepositedTsp",
      "getTotalDepositedTspLp",
      "getTotalDepositedPnutLp",]),
    ...mapMutations([
      "saveTspBalanceInt",
      "saveDepositedTspInt",
      "saveTspLpBalanceInt",
      "saveDepositedTspLpInt",
      "savePnutLpBalanceInt",
      "saveDepositedPnutLpInt"
    ]),

    checkInput() {
      const reg = /^\d+(\.\d+)?$/;
      const res = reg.test(this.inputValue) && parseFloat(this.inputValue) > 0;
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputError"));
        return res;
      }
      const amount = parseFloat(this.inputValue);
      if (this.isAddStake) {
        if (amount > parseFloat(this.tokenBalance)) {
          this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
          return false;
        }
        return true;
      } else {
        if (amount > parseFloat(this.stakedBalance)) {
          this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
          return false;
        }
        return true;
      }
    },
    fillMax() {
      this.inputValue = this.isAddStake
        ? this.tokenBalance
        : this.stakedBalance;
    },
    confirm() {
      this.isAddStake ? this.deposit() : this.withdraw();
    },
    async deposit() {
      if (!this.checkInput()) {
        return;
      }
      try {
        this.isLoading = true;
        const depositInt = amountToInt(parseFloat(this.inputValue));
        const contract = await getContract(this.symbol);
        const res = await contract
          .deposit(depositInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTokenMethod[this.symbol](this.tokenBalanceInt - depositInt);
          if (this.stakedBalanceInt > 0) {
            this.saveStakedMethod[this.symbol](
              this.stakedBalanceInt - (-depositInt)
            );
          } else {
            this.saveStakedMethod[this.symbol](depositInt);
          }
          await this.getTotalStakedMethod[this.symbol]();
          this.$emit("hideMask");
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(this.$t("error.error"), this.$t("error.depositFail"));
          }
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isLoading = false;
      }
    },

    async withdraw() {
      if (!this.checkInput()) {
        return;
      }
      try {
        this.isLoading = true;
        const minusInt = amountToInt(parseFloat(this.inputValue));
        const contract = await getContract(this.symbol);
        const res = await contract
          .withdraw(minusInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTokenMethod[this.symbol](this.tokenBalanceInt - (-minusInt));
          this.saveStakedMethod[this.symbol](this.stakedBalanceInt - minusInt);
          // await this.getPnut();
          // await this.saveTotalStakedMethod[this.symbol]();
          await Promise.all([this.getPnut(),this.getTotalStakedMethod[this.symbol]()])
          this.$emit("hideMask");
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(this.$t("error.error"), this.$t("error.depositFail"));
          }
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isLoading = false;
      }
    },

    showTip(title, message) {
      this.tipTitle = title;
      this.tipMessage = message;
      this.showMessage = true;
    },
    hideMask() {
      if (this.isLoading) return;
      this.$emit("hideMask");
    },
    cancel() {
      this.hideMask();
    },
  },

  mounted() {
    this.saveTokenMethod = {
      TSP_POOL: this.saveTspBalanceInt,
      TSP_LP_POOL: this.saveTspLpBalanceInt,
      PNUT_LP_POOL: this.savePnutLpBalanceInt,
    },
    this.saveStakedMethod = {
      TSP_POOL: this.saveDepositedTspInt,
      TSP_LP_POOL: this.saveDepositedTspLpInt,
      PNUT_LP_POOL: this.saveDepositedPnutLpInt,
    },
    this.getTotalStakedMethod = {
      TSP_POOL: this.getTotalDepositedTsp,
      TSP_LP_POOL: this.getTotalDepositedTspLp,
      PNUT_LP_POOL: this.getTotalDepositedPnutLp,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 420px;
  margin-top: -20%;
}
</style>