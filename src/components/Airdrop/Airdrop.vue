<template>
  <div class="airdrop">
    <h3>
      {{ $t("airdrop.airdrop") }}
    </h3>
    <div class="container">
      <div class="airdrop-area">
        <Card>
          <div class="title-box">
            <span class="title">
              <p class="title">WhereIN {{ $t("airdrop.airdrop") }}</p>
            </span>
          </div>

          <div class="pending-box">
            <p class="airdrop-des">
              <span class="info-token">{{ $t("airdrop.whereinDes") }}</span>
            </p>
          </div>

          <div class="pending-box">
            <p class="info-title">
              <span class="info-token">PNUT</span>
              <span class="info-desc">AIRDROP</span>
            </p>
            <div class="pending-input">
              <span class="token-number-none">
                {{ whereinAmount }}
              </span>
              <b-button
                variant="primary"
                @click="harvestWherein"
                :disabled="whereinDrawn || whereinAmount === 0 || !isLogin || !isConnectTron || isLoadingWherein"
              >
                <b-spinner small type="grow" v-show="isLoadingWherein"></b-spinner>
                {{
                  !whereinDrawn
                    ? $t("message.withdraw")
                    : $t("message.withdrawn")
                }}
              </b-button>
            </div>
            <div class="op-bottom" v-if="!isLogin || !isConnectTron">
              <ConnectWalletBtn
                class="op-bottom"
                v-if="!isLogin"
                @steemLogin="showSteemLogin = true"
              />
              <ConnectWalletBtn
                class="op-bottom"
                v-if="!isConnectTron"
                @tronLogin="showTronLinkInfo"
                type="TRON"
              />
            </div>
          </div>
        </Card>
        <Card>
          <div class="title-box">
            <span class="title">
              <p class="title">NUTBOX {{ $t("airdrop.airdrop") }}</p>
            </span>
          </div>

          <div class="pending-box">
            <p class="airdrop-des">
              <span class="info-token">{{ $t("airdrop.nutboxDes") }}</span>
            </p>
          </div>

          <div class="pending-box">
            <p class="info-title">
              <span class="info-token">NUTBOX</span>
              <span class="info-desc">AIRDROP</span>
            </p>
            <div class="pending-input">
              <span class="token-number-none">
                {{ nutboxAmount }}
              </span>
              <b-button
                variant="primary"
                @click="harvestNutbox"
                :disabled="nutboxDrawn || nutboxAmount === 0 || !isLogin || !isConnectTron || isLoadingNutbox"
              >
                <b-spinner small type="grow" v-show="isLoadingNutbox"></b-spinner>
                {{
                  !nutboxDrawn
                    ? $t("message.withdraw")
                    : $t("message.withdrawn")
                }}
              </b-button>
            </div>
            <div class="op-bottom" v-if="!isLogin || !isConnectTron">
              <ConnectWalletBtn
                class="op-bottom"
                v-if="!isLogin"
                @steemLogin="showSteemLogin = true"
              />
              <ConnectWalletBtn
                class="op-bottom"
                v-if="!isConnectTron"
                @tronLogin="showTronLinkInfo"
                type="TRON"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
    <Login v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
    <InstallTronLink
      v-if="showInstallTronLink"
      @hideMask="showInstallTronLink = false"
    />
  </div>
</template>

<script>
import Card from "../ToolsComponents/Card";
import { custom_json } from "../../utils/chain/steem";
import { getAirdropInfo } from "@/apis/api";
import TipMessage from "../ToolsComponents/TipMessage";
import { sleep } from "../../utils/helper";
import { mapActions, mapState } from "vuex";
import { TRON_LINK_ADDR_NOT_FOUND } from '@/config'
import Login from "../Login";
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";
import InstallTronLink from "../ToolsComponents/InstallTronLink";
import {
  getTronLinkAddr,
} from "@/utils/chain/tron";

export default {
  name: "Airdrop",
  data() {
    return {
      airdropList: [],
      isLoadingWherein: true,
      isLoadingNutbox: true,
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      showSteemLogin: false,
      showInstallTronLink: false,

    };
  },
  components: {
    Card,
    TipMessage,
    Login,
    ConnectWalletBtn,
    InstallTronLink
  },
  computed: {
      ...mapState(['steemAccount', 'tronAddress']),
    wherein() {
      const w = this.airdropList.filter((a) => a.type === "wherein");
      if (w.length > 0) {
        const drawn = w.filter(f => f.state === 'drawn')
        const pending = w.filter(f => f.state === 'pending')
        if (pending.length > 0){
          return pending[0]
        }else{
          return drawn[0]
        }
      }
      return 0;
    },
    nutbox() {
      const w = this.airdropList.filter((a) => a.type === "nutbox");
      if (w.length > 0) {
        const drawn = w.filter(f => f.state === 'drawn')
        const pending = w.filter(f => f.state === 'pending')
        if (pending.length > 0){
          return pending[0]
        }else{
          return drawn[0]
        }
      }
      return 0;
    },
    whereinNoAirdrop() {
      return this.wherein === 0;
    },
    nutboxNoAirdrop() {
      return this.nutbox === 0;
    },
    whereinDrawn() {
      if (this.whereinNoAirdrop) return false;
      return this.wherein.state === "drawn";
    },
    nutboxDrawn() {
      if (this.nutboxNoAirdrop) return false;
      return this.nutbox.state === "drawn";
    },
    whereinAmount() {
      if (this.whereinNoAirdrop) return 0;
      return this.wherein.amount;
    },
    nutboxAmount() {
      if (this.nutboxNoAirdrop) return 0;
      return this.nutbox.amount;
    },
    isLogin() {
      return this.steemAccount && this.steemAccount.length > 0;
    },
    isConnectTron() {
      return (
        this.tronAddress &&
        this.tronAddress.length > 0 &&
        this.tronAddress !== TRON_LINK_ADDR_NOT_FOUND.noTronLink &&
        this.tronAddress !== TRON_LINK_ADDR_NOT_FOUND.walletLocked
      );
    },
  },
  methods: {
    ...mapActions(["getPnut"]),

    async harvestWherein() {
      this.isLoadingWherein = true;
      try {
        const res = await custom_json(
          this.steemAccount,
          this.tronAddress,
          this.whereinAmount,
          'wherein'
        );
        if (res) {
          await sleep(10);
          this.getPnut();
          const res = await getAirdropInfo({
            author: this.steemAccount,
          });
          if (res) this.airdropList = res;
        } else {
          this.showTip($t("error.error"), "Harvest Failed");
        }
      } catch (e) {
        this.showTip($t("error.error"), e.message);
      } finally {
        this.isLoadingWherein = false;
      }
    },
    async harvestNutbox() {
      this.isLoadingNutbox = true;
      try {
        const res = await custom_json(
          this.steemAccount,
          this.tronAddress,
          this.nutboxAmount,
          'nutbox'
        );
        if (res) {
          await sleep(10);
          this.getPnut();
          const res = await getAirdropInfo({
            author: this.steemAccount,
          });
          if (res) this.airdropList = res;
        } else {
          this.showTip($t("error.error"), "Harvest Failed");
        }
      } catch (e) {
        this.showTip($t("error.error"), e.message);
      } finally {
        this.isLoadingNutbox = false;
      }
    },
    async showTronLinkInfo() {
      const address = await getTronLinkAddr();
      if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
        this.showInstallTronLink = true;
      } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
        this.tipTitle = this.$t("message.tips");
        this.tipMessage = this.$t("error.unlockWallet");
        this.tipType = "tip";
        this.showMessage = true;
      } else if (address) {
        this.$store.dispatch("initializeTronAccount", address);
        this.$router.go(0);
      }
    },
      showTip(title, message) {
        this.tipTitle = title;
        this.tipMessage = message;
        this.showMessage = true;
      },
  },

  watch: {
      async steemAccount(newValue, oldValue) {
           const res = await getAirdropInfo({
            author: newValue,
            });
            this.isLoadingWherein = false;
            this.isLoadingNutbox = false;
            this.airdropList = res;
      }
  },
  async mounted() {
    const res = await getAirdropInfo({
      author: this.steemAccount,
    });
    console.log('airdrop', res);
    this.isLoadingWherein = false;
    this.isLoadingNutbox = false
    this.airdropList = res;
  },
};
</script>

<style lang="less" scoped>
.airdrop {
  padding: 0px 40px 64px;
  h3 {
    margin-bottom: 64px;
  }
  .container {
    display: flex;
    align-content: center;
    justify-content: center;
    .airdrop-area {
      display: flex;
      justify-content: space-around;
      width: 100%;
      max-width: 800px;
      .card {
        margin-top: 40px;
        width: 320px;
        // height: 370px;

        .title-box {
          display: flex;
          align-content: left;
          align-items: center;

          img {
            width: 56px;
            height: 56px;
          }

          .title {
            margin-left: 8px;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: var(--primary-text);
            line-height: 24px;
          }
        }

        .airdrop-des {
          font-size: 14px;
          text-align: left;
          color: var(--primary-text);
        }
        .info-title {
          text-align: left;
          margin: 0px;
          line-height: 12px;

          .info-token {
            font-size: 12px;
            color: var(--secondary-text);
            margin-right: 8px;
          }

          .info-desc {
            font-size: 12px;
            color: var(--disable);
          }
        }

        .waiting-info-box {
          display: flex;
          justify-content: center;
          justify-items: center;
          align-items: center;
          height: 80%;
        }

        .pending-box {
          margin-top: 20px;

          .pending-input {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
