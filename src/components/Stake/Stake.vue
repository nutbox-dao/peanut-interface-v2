<template>
  <div id="stake" style="padding: 0px 40px 64px;">
    <h3>
        {{ this.$t('stake.stake') }}
    </h3>
    <b-row>
      <b-col
        md="10"
        offset-md="1"
        sm="12"
        offset-sm="0"
        lg="8"
        offset-lg="2"
        xl="6"
        offset-xl="3"
      >
        <div class="stake">
          <Card v-if="steemAccount && steemAccount.length > 0">
            <div class="stake-box">
              <p>
                {{ $t("message.spbalance") }} : {{ spBalance | amountForm }} SP
              </p>
              <p>
                {{ $t("message.yourspdelegate") }} :
                {{ delegatedSp | amountForm }} SP
              </p>
              <p>
                {{ $t("message.pnutbalance") }} :
                {{ pnutBalance | amountForm }} PNUT
              </p>
              <input
                placeholder="0.0"
                v-model="delegatevalue"
                inputmode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                spellcheck="false"
              />
              <!-- 初始代理 -->
              <div v-if="!delegated" class="btn-container">
                <b-button
                  variant="primary"
                  @click="delegate"
                  style="width: 100%"
                  :disabled="loading"
                >
                  <b-spinner
                    small
                    type="grow"
                    v-show="delegateLoading"
                    variant="alert"
                    style="margin-right: 8px"
                  ></b-spinner>
                  {{ $t("message.confirmdelegate") }}
                </b-button>
              </div>
              <div v-else class="btn-container">
              <!-- 增加代理 -->
                <b-button
                  variant="primary"
                  @click="addDelegate"
                  :disabled="loading"
                >
                  <b-spinner
                    small
                    type="grow"
                    v-show="addLoading"
                    variant="alert"
                    style="margin-right: 8px"
                  ></b-spinner
                  >{{ $t("message.adddelegate") }}</b-button
                >
                <!-- 减少代理 -->
                <b-button
                  variant="primary"
                  @click="minusDelegate"
                  :disabled="loading"
                >
                  <b-spinner
                    small
                    type="grow"
                    v-show="minusLoading"
                    variant="alert"
                    style="margin-right: 8px"
                  ></b-spinner
                  >{{ $t("message.minusdelegate") }}</b-button
                >
                <!-- 取消代理 -->
                <b-button
                  variant="primary"
                  @click="cancelDelegate"
                  :disabled="loading"
                >
                  <b-spinner
                    small
                    type="grow"
                    v-show="cancelLoading"
                    variant="alert"
                    style="margin-right: 8px"
                  ></b-spinner
                  >{{ $t("message.canceldelegate") }}</b-button
                >
              </div>
              <!-- pending peanut -->
              <p class="pending-pnut" v-if="delegated">
                <span>{{ $t("message.pnutprofits") }}</span>
                <span style="color: darkred"
                  ><strong>{{ pendingPnut }} </strong></span
                >
              </p>
              <!-- 提现 -->
              <div v-if="delegated" class="btn-container">
                <b-button
                  variant="primary"
                  @click="withdrawPnut"
                  style="width: 100%"
                  :disabled="loading"
                >
                  <b-spinner
                    small
                    type="grow"
                    v-show="withdrawLoading"
                    variant="alert"
                    style="margin-right: 8px"
                  ></b-spinner
                  >{{ $t("message.withdraw") }}
                </b-button>
              </div>
            </div>
            <!--手续费-->
            <p class="fee">
              {{ $t("message.delegatecharge") }}： {{ fee }} STEEM
            </p>
          </Card>
          <Login v-else />
        </div>
      </b-col>
    </b-row>
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
import Login from "../Login";
import TipMessage from "../ToolsComponents/TipMessage";
import { getContract } from "../../utils/chain/contract";
import { amountToInt, intToAmount, isTransactionSuccess, isInsufficientEnerge } from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { steemDelegation } from "../../utils/chain/steem";
import {
  TRON_CONTRACT_CALL_PARAMS,
  STEEM_STAKE_FEE,
  STEEM_MINE_ACCOUNT,
} from "../../config";

export default {
  name: "Stake",
  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      delegatevalue: "",
      pendingPnut: "0.000000",
      fee: STEEM_STAKE_FEE,
      loading: false,
      delegateLoading: false,
      addLoading: false,
      minusLoading: false,
      cancelLoading: false,
      withdrawLoading: false,
    };
  },
  computed: {
    ...mapState([
      "steemAccount",
      "tronAddress",
      "steemBalance",
      "vestsToSteem",
      'vestsBalance'
    ]),
    ...mapGetters(["spBalance", "pnutBalance", "delegatedSp"]),

    delegated() {
      return this.delegatedSp && this.delegatedSp > 0;
    },
  },
  components: {
    Card,
    Login,
    TipMessage,
  },
  methods: {
    ...mapActions(["getVests", "getSteem", "getPnut", "getDelegatedSp"]),
    ...mapMutations([
      "saveSteemBalance",
      "saveVestsBalance",
      "savePnutBalanceInt",
      "saveDelegatedVestsInt",
    ]),

    async getPendingPeanut() {
      try{
        const nutPool = await getContract("PNUT_POOL");
        if (!nutPool) return;
        let s = await nutPool.getPendingPeanuts().call();
        this.pendingPnut = intToAmount(s);
      }catch(e){

      }
    },

    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.delegatevalue) && parseFloat(this.delegatevalue) > 0;
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputError"));
      }
      return res;
    },

    async checkAddress() {
      try{
        const nutPool = await getContract("PNUT_POOL");
        const res = await nutPool.delegators(this.tronAddress).call();
        const steemAcc = res.steemAccount;
        if (
          this.steemAccount &&
          res.hasDeposited &&
          steemAcc !== this.steemAccount
        ) {
          this.showTip(this.$t("error.delegateerror"), this.$t("error.accountChanged"))
          return false;
        } else {
          return true;
        }
      }catch(e){
        this.showTip(this.$t("error.delegateerror"),e.message)
        return false
      }
    },

    checkDelegateFee(){
      if(this.steemBalance >= STEEM_STAKE_FEE){
        return true
      }
      this.showTip(this.$t("error.delegateerror"), this.$t("error.notEnoughFee"))
      return false
    },

    delegate() {
      this.delegateLoading = true
      this.delegateSp(this.delegatevalue)
    },

    addDelegate() {
      this.addLoading = true
      this.delegateSp(this.delegatedSp + this.delegatevalue)
    },

    minusDelegate() {
      this.minusLoading = true
      this.delegateSp(this.delegatedSp - this.delegatevalue)
    },

    cancelDelegate() {
      this.cancelLoading = true
      this.delegateSp(0)
    },

    async delegateSp(sp){
      try {
        sp = parseFloat(sp)
        this.loading = true
        if ((sp != 0 && !this.checkInputValue()) || !(await this.checkAddress()) || !this.checkDelegateFee()) {
          this.loading = false
          this.delegateLoading = false
          return;
        }
        const amount = parseFloat(
          sp / this.vestsToSteem
        ).toFixed(6);
        const res = await steemDelegation(
          this.steemAccount,
          STEEM_MINE_ACCOUNT,
          amount,
          this.tronAddress
        );
        if (res.success === true) {
          this.getVests();
          this.getSteem();
          this.saveDelegatedVestsInt(amountToInt(parseFloat(amount)))
        } else {
          this.showTip(this.$t("error.delegateerror"),res.message)
        }
      } catch (e) {
        this.showTip(this.$t("error.delegateerror"),e.message)
      } finally {
        this.delegatevalue = "";
        this.loading = false
        this.delegateLoading = false
        this.addLoading = false
        this.minusLoading = false
        this.cancelLoading = false
      }
    },

    async withdrawPnut() {
      try{
        this.loading = true
        this.withdrawLoading = true
        const pnutPool = await getContract('PNUT_POOL')
        let res = await pnutPool
          .withdrawPeanuts()
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.getPnut();
        } else {
          if (res && await isInsufficientEnerge(res)) {
            this.showTip(this.$t("error.error"), this.$t("error.insufficientEnerge"))
          } else {
            this.showTip(this.$t("error.error"), this.$t("error.withdrawFail"))
          }
        }
      }catch(e){
        this.showTip(this.$t("error.error"), e)
      }finally{
        this.loading = false
        this.withdrawLoading = false
      }
    },

    showTip(title,message) {
      this.tipTitle = title;
      this.tipMessage = message;
      this.showMessage = true;
    },
  },
  mounted() {
    if (this.steemAccount && this.steemAccount.length > 0) {
      this.getVests();
      this.getSteem();
    }
    if (this.tronAddress && this.tronAddress.length > 0) {
      this.getPnut();
      this.getDelegatedSp();
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
@import "../../static/css/stake.less";
</style>
