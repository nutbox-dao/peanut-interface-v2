<template>
  <transition name="fade">
    <div class="mask" @click.self="hideMask">
      <Card>
        <h5>{{ operate === "add" ? "Delegate SP" : "Undelegate SP" }}</h5>
        <div class="input-box">
          <div class="input-title">
            <span>Delegate</span>
            <span
              >Balance:{{ operate === "add" ? formSP : formDelegatedSP }}</span
            >
          </div>
          <div class="input-area">
            <input placeholder="0" type="text" v-model="delegatevalue" />
            <b-button variant="primary" @click="fillMax">
              {{ $t("message.max") }}
            </b-button>
          </div>
        </div>
        <div class="bottom">
          <button @click="cancel">{{ $t("message.cancel") }}</button>
          <button @click="confirm">{{ $t("message.confirm") }}</button>
        </div>
        <p class="fee">{{ $t("message.delegatecharge") }}： {{ fee }} STEEM</p>
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
import { getContract } from "../../utils/chain/contract";
import { formatBalance } from "../../utils/helper";

import {
  amountToInt,
} from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { steemDelegation } from "../../utils/chain/steem";
import {
  STEEM_STAKE_FEE,
  STEEM_MINE_ACCOUNT,
} from "../../config";

export default {
  name: "ChangeDelegateMask",
  data() {
    return {
      delegatevalue: "",
      fee: STEEM_STAKE_FEE,
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapState([
      "steemAccount",
      "tronAddress",
      "steemBalance",
      "vestsToSteem",
      "vestsBalance",
    ]),
    ...mapGetters(["spBalance", "delegatedSp"]),
    formSP() {
      return formatBalance(this.spBalance);
    },
    formDelegatedSP() {
      return formatBalance(this.delegatedSp);
    },
  },
  components: {
    Card,
    TipMessage,
  },
  props: {
    operate: {
      type: String,
      default: "add",
    },
  },
  methods: {
    ...mapActions(["getVests", "getSteem", "getPnut", "getDelegatedSp"]),
    ...mapMutations([
      "saveSteemBalance",
      "saveVestsBalance",
      "saveDelegatedVestsInt",
    ]),

    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.delegatevalue) && parseFloat(this.delegatevalue) > 0;
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputError"));
      }
      return res;
    },

    hideMask() {
      if (this.isLoading) return;
      this.$emit("hideMask");
    },
    fillMax() {
      console.log(this.operate);
      this.delegatevalue =
        this.operate === "add" ? this.spBalance : this.delegatedSp;
    },
    cancel() {
      this.hideMask();
    },
    async confirm() {
      let sp = 0;
      if (this.operate === "add") {
        sp = parseFloat(this.delegatedSp) + parseFloat(this.delegatevalue);
      } else {
        sp = parseFloat(this.delegatedSp) - parseFloat(this.delegatevalue);
      }
      this.delegateSp(sp);
    },
    async checkAddress() {
      try {
        const nutPool = await getContract("PNUT_POOL");
        const res = await nutPool.delegators(this.tronAddress).call();
        const steemAcc = res.steemAccount;
        if (
          this.steemAccount &&
          res.hasDeposited &&
          steemAcc !== this.steemAccount
        ) {
          this.showTip(
            this.$t("error.delegateerror"),
            this.$t("error.accountChanged")
          );
          return false;
        } else {
          return true;
        }
      } catch (e) {
        this.showTip(this.$t("error.delegateerror"), e.message);
        return false;
      }
    },
    async delegateSp(sp) {
      try {
        sp = parseFloat(sp);
        this.isLoading = true;
        if (
          (sp !== 0 && !this.checkInputValue()) ||
          !(await this.checkAddress()) ||
          !this.checkDelegateFee()
        ) {
          this.isLoading = false;
          return;
        }
        const amount = parseFloat(sp / this.vestsToSteem).toFixed(6);
        const res = await steemDelegation(
          this.steemAccount,
          STEEM_MINE_ACCOUNT,
          amount,
          this.tronAddress
        );
        if (res.success === true) {
          this.getVests();
          this.getSteem();
          this.saveDelegatedVestsInt(amountToInt(parseFloat(amount)));
          this.$emit('hideMask')
        } else {
          this.showTip(this.$t("error.delegateerror"), res.message);
        }
      } catch (e) {
        this.showTip(this.$t("error.delegateerror"), e.message);
      } finally {
        this.delegatevalue = "";
        this.isLoading = false;
      }
    },

    checkDelegateFee() {
      if (this.steemBalance >= STEEM_STAKE_FEE) {
        return true;
      }
      this.showTip(
        this.$t("error.delegateerror"),
        this.$t("error.notEnoughFee")
      );
      return false;
    },
    showTip(title, message) {
      this.tipTitle = title;
      this.tipMessage = message;
      this.showMessage = true;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.card {
    width: 420px;
    margin-top: -20%;
  }
  .fee {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: gray;
    margin-top: 1rem;
    margin-bottom: 0;
  }

</style>