<template>
  <div id="vote">
    <h3>
      {{ $t("exchange.exchange") }}
    </h3>
    <h5>
      {{ $t("exchange.title") }}
    </h5>
    <div class="nav"></div>
    <div class="vote-container">
      <div class="vote-box">
        <p class="title">
          {{ $t("exchange.swap") }}
        </p>
        <div class="link-input">
          <p>{{ $t("exchange.recipient") }}</p>
          <input
            type="text"
            v-model="recipient"
            :placeholder="$t('exchange.recipientPlaceholder')"
          />
        </div>
        <div class="pnut-input">
          <p>{{ $t("exchange.amount") }}</p>
          <div class="input-area" v-if="tronAddress && tronAddress.length > 0">
            <div>
              <input type="text" v-model="pnutAmount" placeholder="0" />
              <p class="tips" style="margin-top: 8px;">
                  {{ $t('message.balance') }}: {{ pnutBalance }}
              </p>
            </div>
            <b-button
              class="transfer-btn"
              variant="primary"
              @click="transferPnut"
              :disabled="isTransfering"
            >
              <b-spinner
                small
                type="grow"
                v-show="isTransfering"
              ></b-spinner>
              {{ $t("exchange.swap") }}
            </b-button>
          </div>
          <b-button
            class="login-btn"
            variant="primary"
            @click="connectTron"
            v-else
          >
            <b-spinner small type="grow" v-show="isLoging"></b-spinner>
            {{ $t("wallet.connectTron") }}
          </b-button>
        </div>
      </div>
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      :type="tipType"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
    <InstallTronLink
      v-if="showInstallTronLink"
      @hideMask="showInstallTronLink = false"
    />
  </div>
</template>

<script>
import TipMessage from "../ToolsComponents/TipMessage";
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";
import InstallTronLink from "../ToolsComponents/InstallTronLink";
import { mapGetters, mapState } from "vuex";
import {
  PNUT_FOR_VOTE_RATE,
  POST_LINK_REG,
  TRON_PNUT_RECEIVE_ACCOUNT,
  TRON_LINK_ADDR_NOT_FOUND,
  STEEM_MINE_ACCOUNT,
} from "../../config";
import {
  amountToInt,
  getTronLinkAddr,
  transferPnut,
} from "../../utils/chain/tron";
import { getAccountInfo, postHasVotedByNutbox } from "../../utils/chain/steem";
import { ethers } from 'ethers'

export default {
  name: "Vote",
  computed: {
    ...mapState(["tronAddress"]),
    ...mapGetters(["pnutBalance"]),
  },
  data() {
    return {
      showMessage: false,
      tipTitle: "",
      tipType: "error",
      tipMessage: "",
      payRate: PNUT_FOR_VOTE_RATE,
      recipient: "",
      pnutAmount: "",
      isLoging: false,
      isTransfering: false,
      isReady: false,
      showInstallTronLink: false,
      balance: 0
    };
  },
  components: {
    TipMessage,
    ConnectWalletBtn,
    InstallTronLink,
  },
  methods: {
    async connectTron() {
      this.isLoging = true;
      const address = await getTronLinkAddr();
      this.isLoging = false;
      if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
        this.showInstallTronLink = true;
      } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
        this.tipTitle = this.$t("message.tips");
        this.tipMessage = this.$t("error.unlockWallet");
        this.tipType = "tip";
        this.showMessage = true;
      } else if (address) {
        this.$store.dispatch("getPnut");
      }
    },
    checkAddress() {
      const res = ethers.utils.isAddress(this.recipient)
      this.recipient = ethers.utils.getAddress(this.recipient)
       if (!res) {
           this.showTip(this.$t("error.error"), this.$t("exchange.wrongAddress"));
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
        this.showTip(this.$t("error.error"), this.$t("error.insufficentPnut"));
        return false;
      }
      return true;
    },

    async transferPnut() {
      if (!this.checkAddress() || !this.checkPnutAmount()) {
        return;
      }
      try {
        this.isTransfering = true;

        const res = await transferPnut(
          'TLmaTUuGmYjxkRmX1qn28HFFAM7tguGvXb',
          amountToInt(this.pnutAmount),
          this.recipient.substring(2)
        );
        if (res) {
          this.recipient = "";
          this.pnutAmount = "";
        } else {
          this.showTip(this.$t("error.error"), this.$t("error.transferFail"));
        }
      } catch (e) {
        this.showTip(this.$t("error.error"), e.message);
      } finally {
        this.isTransfering = false;
      }
    },
    showTip(titel, message) {
      this.tipTitle = titel;
      this.tipMessage = message;
      this.tipType = "error";
      this.showMessage = true;
    },
  },
  async mounted() {
    if (
      this.$store.state.tronAddress &&
      this.$store.state.tronAddress.length > 0
    ) {
      this.$store.dispatch("getPnut");
    }
  },
};
</script>

<style lang="scss" scoped>
#vote {
  padding: 0px 40px 64px;
  min-height: 680px;
  background-image: url('../../static/images/back-ground.png');
  background-position: center 340px;
  background-repeat: no-repeat;
  h5 {
    text-align: left;
    margin-top: 12px;
    font-size: 16px;
    font-weight: 300;
    color: var(--secondary-text);
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
    margin-top: 6rem;
    .vote-box {
      margin: 0;
      width: 492px;
      padding: 24px;
      background: #ffffff;
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.02);
      background-image: url("../../static/images/upvote-back.svg");
      background-position: right top;
      background-repeat: no-repeat;
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
      .upvote-icon {
        margin: 36px 0 0 0;
        width: 56px;
        height: 56px;
        border: 1px solid var(--primary);
        border-radius: 28px;
        background-image: url("../../static/images/upvote-hover.svg");
        background-repeat: no-repeat;
        background-position: center center;
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
        .login-btn {
          width: 444px;
          height: 68px;
        }
        .input-area {
          display: flex;
          justify-content: space-between;
          input {
            font-size: 24px;
            font-family: DINAlternate-Bold, DINAlternate;
            background-color: var(--background);
            border-radius: 16px;
            padding-left: 16px;
            border: none;
            height: 48px;
          }
          p {
            display: flex;
            align-items: center;
          }
          .pnut-for-upvote {
            margin: 6px 2px 0 0;
            font-size: 18px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            margin: 0 6px 0 0;
            color: var(--success);
          }
          .tips {
            font-size: 14px;
            font-weight: 600;
          }
          .transfer-btn {
            width: 164px;
            height: 68px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .get-vote-info {
    font-size: 14px;
    margin-top: 24px;
    margin-bottom: 0px;
    text-align: left;
    color: var(--disable);
  }
}
</style>