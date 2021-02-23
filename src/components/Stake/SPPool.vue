<template>
  <div class="stake">
    <Card>
      <div class="stake-box">
        <div class="title">
          <img :src="spLogo" alt="" />
          <span>
            {{ $t("message.delegatemine") }}
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
            {{ $t("message.yourspdelegate") }}
          </p>
          <div v-if="delegated && isLogin">
            <span>
              {{ delegatedSp | amountForm }}
            </span>
            <button @click="minusDelegate">-</button>
            <button @click="addDelegate">+</button>
          </div>
          <div v-if="!delegated && isLogin">
            <span> 0 </span>
            <b-button @click="delegate">
              {{ $t("message.delegatemine") }}
            </b-button>
          </div>
          <ConnectWalletBtn v-if="!isLogin" @steemLogin="showSteemLogin=true"/>
        </div>
      </div>
      <!--手续费-->
      <p class="fee">
        <span>APY</span>
        <span>{{ apy }}</span>
      </p>

      <p class="fee">
        <span>
          {{ $t("message.sptotaldelegate") }}
        </span>
        <span>
          {{totalDelegatedSp | amountForm}}
        </span>
      </p>

    </Card>
    <Login v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
    <ChangeDelegateMask :operate="operate" v-if="showChangeDelegateMask" @hideMask="showChangeDelegateMask=false"/>
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
import ChangeDelegateMask from './ChangeDelegateMask'
import Login from "../Login";
import { getContract } from "../../utils/chain/contract";
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";

import {
  intToAmount,
  isTransactionSuccess,
  isInsufficientEnerge,
} from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  TRON_CONTRACT_CALL_PARAMS,
} from "../../config";

export default {
  name: "SPPool",
  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      pendingPnut: "0.000000",
      loading: false,
      showSteemLogin:false,
      withdrawLoading: false,
      showChangeDelegateMask:false,
      operate:"add",
      spLogo: "https://coin.top/production/upload/logo/TW2EWoRUJfwH9nMTfLxSL9JPLZeusUtTfR.jpeg?t=1608343575484",
    };
  },
  computed: {
    ...mapState([
      "steemAccount",
      "tronAddress",
      "steemBalance",
      "vestsToSteem",
      "vestsBalance",
      "apy",
    ]),
    ...mapGetters(["spBalance", "pnutBalance", "delegatedSp","totalDelegatedSp"]),

    delegated() {
      return this.delegatedSp && this.delegatedSp > 0;
    },
    isLogin() {
      return this.steemAccount && this.steemAccount.length > 0;
    },
  },
  components: {
    Card,
    TipMessage,
    ConnectWalletBtn,
    Login,
    ChangeDelegateMask
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
      try {
        const nutPool = await getContract("PNUT_POOL");
        if (!nutPool) return;
        const s = await nutPool.getPendingPeanuts().call();
        this.pendingPnut = intToAmount(s);
      } catch (e) {}
    },

    delegate() {
      this.operate = 'add'
      this.showChangeDelegateMask = true
    },

    addDelegate() {
      this.delegate();
    },

    minusDelegate() {
      this.operate = 'minus'
      this.showChangeDelegateMask = true
    },

    async withdrawPnut() {
      try {
        this.loading = true;
        this.withdrawLoading = true;
        const pnutPool = await getContract("PNUT_POOL");
        const res = await pnutPool
          .withdrawPeanuts()
          .send(TRON_CONTRACT_CALL_PARAMS);
        if (res && (await isTransactionSuccess(res))) {
          this.getPnut();
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
        this.loading = false;
        this.withdrawLoading = false;
      }
    },

    showTip(title, message) {
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
      // this.getPnut();
      this.getDelegatedSp();
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
