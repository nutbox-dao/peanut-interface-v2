<template>
  <div class="farm-box">
    <Card>
      <div>
        <p>{{ $t("farm.tspLp.tspLPBalance") }} : {{ tspLpBalance | amountForm }}</p>
        <p>
          {{ $t("farm.tspLp.yourTSPLPAmount") }} : {{ depositedTspLp | amountForm }}
        </p>
        <p>{{ $t("message.apy") }} : {{ apy }}</p>
        <input
          placeholder="0.0"
          v-model="depositeValue"
          inputmode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          spellcheck="false"
        />
        <div class="btn-container">
          <b-button
            variant="primary"
            style="width: 100%"
            @click="approve"
            :disabled="loading"
            ><b-spinner
              small
              type="grow"
              v-show="approveLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("farm.tsp.approveNutbox") }}
          </b-button>
        </div>
        <div class="btn-container" v-if="!deposited">
          <b-button
            variant="primary"
            style="width: 100%"
            @click="deposite"
            :disabled="loading"
          >
            <b-spinner
              small
              type="grow"
              v-show="depositeLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("farm.tsp.confirmDeposit") }}
          </b-button>
        </div>
        <div class="btn-container" v-if="deposited">
          <b-button variant="primary" @click="addDeposit" :disabled="loading"
            ><b-spinner
              small
              type="grow"
              v-show="addLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("farm.tsp.addTspDeposit") }}
          </b-button>
          <b-button variant="primary" @click="minusDeposit" :disabled="loading"
            ><b-spinner
              small
              type="grow"
              v-show="minusLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("farm.tsp.minusTspDeposit") }}
          </b-button>
          <b-button variant="primary" @click="cancelDeposit" :disabled="loading"
            ><b-spinner
              small
              type="grow"
              v-show="cancelLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("farm.tsp.cancelTspDeposit") }}
          </b-button>
        </div>
        <p class="pending-pnut" v-if="deposited">
          <span>{{ $t("message.pnutprofits") }}</span>
          <span style="color: darkred"
            ><strong>{{ pendingPnut }} </strong></span
          >
        </p>

        <div class="btn-container" v-if="deposited">
          <b-button
            variant="primary"
            @click="withdraw"
            style="width: 100%"
            :disabled="loading"
          >
            <b-spinner
              small
              type="grow"
              v-show="withdrawLoading"
              variant="alert"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("message.withdraw") }}
          </b-button>
        </div>
      </div>
    </Card>
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
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { TSP_LP_POOL_ADDRESS, TRON_CONTRACT_CALL_PARAMS, TSP_LP_TOKEN_ADDRESS } from "../../config";
import {
  intToAmount,
  getTronLink,
  amountToInt,
  isTransactionSuccess,
  isInsufficientEnerge,
} from "../../utils/chain/tron";
import { getContract } from "../../utils/chain/contract";

export default {
  name: "TSPLPPool",
  components: {
    Card,
    TipMessage,
  },
  data() {
    return {
      loading: false,
      tipTitle: "",
      tipMessage: "",
      showMessage: false,
      pendingPnut: "0.000000",
      depositeValue: "",
      approveLoading: false,
      depositeLoading: false,
      addLoading: false,
      minusLoading: false,
      cancelLoading: false,
      withdrawLoading: false,
      approved: false,
    };
  },
  computed: {
    ...mapState(["tronAddress", "tspLpBalanceInt", "depositedTspLpInt", 'pnutBalanceInt', 'apy']),
    ...mapGetters(["tspLpBalance", "depositedTspLp", "pnutBalance"]),
    deposited() {
      return this.depositedTspLp && this.depositedTspLp > 0;
    },
  },
  methods: {
    ...mapActions(["getTspLp", "getPnut", "getDepositedTspLp"]),
    ...mapMutations(["saveTspLpBalanceInt", "saveDepositedTspLpInt", "savePnutBalanceInt"]),

    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.depositeValue) && parseFloat(this.depositeValue) > 0;
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputError"));
      }
      return res;
    },

    async approve() {
      if (!this.checkInputValue()) {
        return;
      }
      if (parseFloat(this.depositeValue) > parseFloat(this.tspLpBalance)) {
        this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
        return;
      }
      this.loading = true;
      this.approveLoading = true;
      try {
        const approveInt = amountToInt(parseFloat(this.depositeValue));
        const tronLink = await getTronLink()
        const params = [
            { type: "address", value: TSP_LP_POOL_ADDRESS },
            { type: "uint256", value: approveInt}
        ]
        const { result, transaction } =  await tronLink.transactionBuilder.triggerSmartContract(
            TSP_LP_TOKEN_ADDRESS,
            "approve(address,uint256)",
            TRON_CONTRACT_CALL_PARAMS,
            params,
            this.tronAddress
        )

        if (result && result['result'] !== true){
            this.showTip(this.$t(error.error), this.$t('error.approveFail'))
            return
        }

        const signedTx = await tronLink.trx.sign(transaction)

        const { txid } = await tronLink.trx.sendRawTransaction(signedTx)

        if (txid && (await isTransactionSuccess(txid))) {
          this.loading = false;
          this.approveLoading = false;
          this.approved = true;
        } else {
          if (txid && (await isInsufficientEnerge(txid))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.approveFail")
            );
          }
        }
      } catch (err) {
        this.showTip(this.$t("error.error"), err);
      } finally {
        this.loading = false;
        this.approveLoading = false;
      }
    },

    async deposite() {
      if (!this.checkInputValue()) {
        return;
      }
      if (parseFloat(this.depositeValue) > parseFloat(this.tspLpBalance)) {
        this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
        return;
      }
      this.loading = true;
      this.depositeLoading = true;
      try {
        const depositInt = amountToInt(parseFloat(this.depositeValue));
        const tspLpPoolContract = await getContract("TSP_LP_POOL");
        const res = await tspLpPoolContract
          .deposit(depositInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTspLpBalanceInt(this.tspLpBalanceInt - depositInt);
          this.saveDepositedTspLpInt(depositInt);
          this.approved = false;
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error."),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.depositFail")
            );
          }
        }
      } catch (err) {
        this.showTip(this.$t("error.error"), err);
      } finally {
        this.loading = false;
        this.depositeLoading = false;
      }
    },

    async addDeposit() {
      if (!this.checkInputValue()) {
        return;
      }
      if (parseFloat(this.depositeValue) > parseFloat(this.tspLpBalance)) {
        this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
        return;
      }
      this.loading = true;
      this.addLoading = true;
      try {
        const depositInt = amountToInt(parseFloat(this.depositeValue));
        const tspLpPoolContract = await getContract("TSP_LP_POOL");
        const res = await tspLpPoolContract
          .deposit(depositInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTspLpBalanceInt(this.tspLpBalanceInt - depositInt);
          this.saveDepositedTspLpInt(this.depositedTspLpInt - (-depositInt));
          this.approved = false;
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.depositFail")
            );
          }
        }
      } catch (err) {
        this.showTip(this.$t("error.error"), err);
      } finally {
        this.loading = false;
        this.addLoading = false;
      }
    },

    async minusDeposit() {
      if (!this.checkInputValue()) {
        return;
      }
      if (parseFloat(this.depositeValue) > parseFloat(this.depositedTspLp)) {
        this.showTip(this.$t("error.error"), this.$t("error.inputOverflow"));
        return;
      }
      this.loading = true;
      this.minusLoading = true;
      try {
        const minusInt = amountToInt(parseFloat(this.depositeValue));
        const tspLpPoolContract = await getContract("TSP_LP_POOL");
        const res = await tspLpPoolContract
          .withdraw(minusInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTspLpBalanceInt(this.tspLpBalanceInt - (-minusInt));
          this.saveDepositedTspLpInt(this.depositedTspLpInt - minusInt);
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.depositFail")
            );
          }
        }
      } catch (err) {
        this.showTip(this.$t("error.error"), err);
      } finally {
        this.loading = false;
        this.minusLoading = false;
      }
    },

    async cancelDeposit() {
      this.loading = true;
      this.cancelLoading = true;
      try {
        const minusInt = parseFloat(this.depositedTspLpInt);
        const tspLpPoolContract = await getContract("TSP_LP_POOL");
        const res = await tspLpPoolContract
          .withdraw(minusInt)
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.saveTspLpBalanceInt(this.tspLpBalanceInt - (-minusInt));
          this.saveDepositedTspLpInt(0);
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.insufficientEnerge")
            );
          } else {
            this.showTip(
              this.$t("error.error"),
              this.$t("error.depositFail")
            );
          }
        }
      } catch (err) {
        this.showTip(this.$t("error.error"), err);
      } finally {
        this.loading = false;
        this.cancelLoading = false;
      }
    },

    async withdraw() {
        try{
            this.loading = true
            this.withdrawLoading = true
            const contract = await getContract('TSP_LP_POOL')
            const res = await contract.withdrawPeanuts().send(TRON_CONTRACT_CALL_PARAMS)
            if (res && (await isTransactionSuccess(res))){
                this.savePnutBalanceInt(this.pnutBalanceInt - amountToInt(-parseFloat(this.pendingPnut)))
            }else{
                if (res && (await isInsufficientEnerge(res))){
                    this.showTip(
                    this.$t("error.error"),
                    this.$t("error.insufficientEnerge")
                    );
                }else{
                    this.showTip(
                    this.$t("error.error"),
                    this.$t("error.withdrawFail")
                    );
                }
            }
        }catch(e){
            this.showTip(this.$t('error.error'), e)
        }finally{
            this.loading = false
            this.withdrawLoading = false
        }
    },

    showTip(title, message) {
      this.tipTitle = title;
      this.tipMessage = message;
      this.showMessage = true;
    },

    async getPendingPeanut() {
      try {
        const contract = await getContract("TSP_LP_POOL");
        if (!contract) return;
        let s = await contract.getPendingPeanuts().call();
        this.pendingPnut = intToAmount(s);
      } catch (e) {}
    },
  },
  mounted() {
    if (this.tronAddress && this.tronAddress.length > 0) {
      this.getTspLp();
      // this.getPnut();
      this.getDepositedTspLp();
      //设置定时器以更新当前收益
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
@import "../../static/css/farm.less";
</style>