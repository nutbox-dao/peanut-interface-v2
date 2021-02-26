<template>
  <div id="vote">
    <h3>
      {{ $t("vote.title") }}
    </h3>
    <div class="nav"></div>
    <div class="vote-box">
      <Card>
        <div class="title">
          <img
            src="https://coin.top/production/upload/logo/TPZddNpQJHu8UtKPY1PYDBv2J5p5QpJ6XW.jpeg?t=1603183073762"
            alt=""
          />
          <h5>{{ $t("vote.vote") }}</h5>
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
          <div v-if="tronAddress && tronAddress.length > 0">
            <input
              type="text"
              v-model="pnutAmount"
              :placeholder="$t('vote.pnutPlaceholder')"
            />
            <b-button
              variant="primary"
              @click="transferPnut"
              :disabled="isLoading"
            >
              {{ $t("vote.transfer") }}
            </b-button>
          </div>
          <ConnectWalletBtn type="TRON" @tronLogin="connectTron">
          </ConnectWalletBtn>
        </div>
        <p class="get-vote-info">
          {{ $t("vote.voteRate", { lowerPnutAmount: payRate }) }}
        </p>
      </Card>
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
import Card from "../ToolsComponents/Card";
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
    ...mapGetters(['pnutBalance'])
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
    };
  },
  components: {
    Card,
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
      if (parseFloat(this.pnutBalance) < amount){
        this.showTip(this.$t('error.error',this.$t('error.insufficentPnut')))
        return false
      }
      if (amount < this.payRate || amount > this.payRate * 10) {
        this.showTip(
          this.$t("error.error"),
          this.$t("error.inputOutOfRange", {
            lowerPnutAmount: this.payRate,
            upperPnutAmount: this.payRate * 10,
          })
        );
      }
      return true;
    },

    async transferPnut() {
      if (!this.checkLink() || !this.checkPnutAmount()) {
        return;
      }
      try {
        this.isLoading = true;
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
  .vote-box {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-around;
    padding-top: 20px;
  }
  .get-vote-info {
    font-size: 14px;
  }
}
</style>