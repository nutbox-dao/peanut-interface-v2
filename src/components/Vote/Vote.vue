<template>
  <div id="vote">
    <h3>
      {{ $t("vote.upvote") }}
    </h3>
    <h5>
      {{$t("vote.title")}}
    </h5>
    <div class="nav"></div>
    <div class="vote-container">
      <div class="vote-box">
        <p class="title">
          {{ $t("vote.vote") }}
        </p>
        <div style="display: flex">
          <img
            class="logo"
            src="https://coin.top/production/upload/logo/TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW.jpeg?t=1603183073762"
            alt=""
          />
        </div>
        <div class="link-input">
          <p>{{ $t("vote.link") }}</p>
          <input
            type="text"
            v-model="postLink"
            :placeholder="$t('vote.linkPlaceholder')"
          />
        </div>
        <div class="pnut-input">
          <p>{{ $t("vote.payPnut") }}</p>
          <div class="input-area" v-if="tronAddress && tronAddress.length > 0">
            <input type="text" v-model="pnutAmount" placeholder="0" />
            <b-button
              class="transfer-btn"
              variant="primary"
              @click="transferPnut"
              :disabled="isLoading"
            >
            <b-spinner
            small
            type="grow"
            v-show="isTransfering"
          ></b-spinner>
              {{ $t("vote.transfer") }}
            </b-button>
          </div>
          <b-button
            class="login-btn"
            variant="primary"
            @click="connectTron"
            v-else
          >
          <b-spinner
            small
            type="grow"
            v-show="isLoging"
          ></b-spinner>
            {{ $t("wallet.connectTron") }}
          </b-button>
        </div>
        <p class="get-vote-info">
          {{ $t("vote.voteRate", { lowerPnutAmount: payRate }) }}
        </p>
      </div>
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
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";
import { mapGetters, mapState } from "vuex";
import {
  PNUT_FOR_VOTE_RATE,
  POST_LINK_REG,
  TRON_PNUT_RECEIVE_ACCOUNT,
  TRON_LINK_ADDR_NOT_FOUND,
} from "../../config";
import {
  amountToInt,
  getTronLinkAddr,
  transferPnut,
} from "../../utils/chain/tron";

export default {
  name: "Vote",
  computed: {
    ...mapState(["tronAddress"]),
    ...mapGetters(["pnutBalance"]),
  },
  data() {
    return {
      showMessage: false,
      isLoading: false,
      tipTitle: "",
      tipMessage: "",
      payRate: PNUT_FOR_VOTE_RATE,
      postLink: "",
      pnutAmount: "",
      isLogin:false,
      isTransfering:false,
    };
  },
  components: {
    TipMessage,
    ConnectWalletBtn,
  },
  methods: {
    async connectTron() {
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
        this.$store.dispatch("getPnut");
      }
    },
    checkLink() {
      const match = this.postLink.match(POST_LINK_REG);
      const res = match && match.length > 0;
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputLinkIllegal"));
      }
      return res;
    },
    checkPnutAmount() {
      const reg = /^\d+(\.\d+)?$/;
      const res = reg.test(this.pnutAmount);
      if (!res) {
        this.showTip(this.$t("error.error"), this.$t("error.inputError"));
        return res;
      }
      const amount = parseFloat(this.pnutAmount);
      if (parseFloat(this.pnutBalance) < amount) {
        this.showTip(this.$t("error.error", this.$t("error.insufficentPnut")));
        return false;
      }
      if (amount < this.payRate || amount > this.payRate * 10) {
        this.showTip(
          this.$t("error.error"),
          this.$t("error.inputOutOfRange", {
            lowerPnutAmount: this.payRate,
            upperPnutAmount: this.payRate * 10,
          })
        );
        return false;
      }
      return true;
    },

    async transferPnut() {
      if (!this.checkLink() || !this.checkPnutAmount()) {
        return;
      }
      try {
        this.isLoading = true;
        this.isTransfering = true;
        const res = await transferPnut(
          TRON_PNUT_RECEIVE_ACCOUNT,
          amountToInt(this.pnutAmount),
          this.postLink
        );
        if (res) {
          this.postLink = "";
          this.pnutAmount = "";
        } else {
          this.showTip(this.$t("error.error"), this.$t("error.transferFail"));
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isLoading = false;
        this.isTransfering =false;
      }
    },
    showTip(titel, message) {
      this.tipTitle = titel;
      this.tipMessage = message;
      this.showMessage = true;
    },
  },
  mounted() {
    this.$store.dispatch("getPnut");
  },
};
</script>

<style lang="scss" scoped>
#vote {
  padding: 0px 40px 64px;
  h5 {
    text-align:left;
    margin-top: 12px;
  }
  .nav {
    display: flex;
    align-items: left;
    border-bottom: 1px solid #ddd;
    a {
      border: 0;
      font-size: 20px;
      padding: 10px 24px;
      margin-top: 30px;
      color: #666;
      box-sizing: border-box;
    }
    a:hover {
      background-color: var(--yellow-background);
      text-decoration: none;
    }
    .active {
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
    }
  }
  .vote-container {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    padding-top: 66px;
    .vote-box {
      margin: 0;
      width: 492px;
      height: 392px;
      padding: 24px;
      background: #ffffff;
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.02);
      border-radius: 28px;
      border: 1px solid rgba(227, 229, 232, 0.5);
      .title {
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        margin: 0;
        color: var(--primary-text);
        line-height: 24px;
        font-size: 28px;
        text-align: left;
      }
      .logo {
        margin: 36px 0 0 0;
        width: 56px;
        height: 56px;
        text-align: left;
      }
      .link-input {
        margin-top: 20px;
        p {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--secondary-text);
          line-height: 12px;
        }
        input {
          width: 100%;
          height: 48px;
          background: var(--background);
          border-radius: 16px;
          border: none;
          padding-left: 16px;
        }
      }
      .pnut-input {
        margin: 26px 0 0 0;
        p {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--secondary-text);
          line-height: 12px;
          margin-bottom: 8px;
        }
        .input-area {
          display: flex;
          justify-content: space-between;
          input {
            font-size: 24px;
            font-family: DINAlternate-Bold, DINAlternate;
          }
          .transfer-btn {
            width: 246px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .get-vote-info {
    font-size: 14px;
    margin-top: 24px;
    text-align: left;
    color: var(--disable)
  }
}
</style>