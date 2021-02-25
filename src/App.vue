<template>
  <div id="app">
    <div class="left">
      <img src="./static/images/logo.svg" alt="nutbox" class="logo" />
      <b-nav pills vertical align="center" class="menu">
        <b-nav-item to="/wallet">
          <b-icon icon="person-fill"></b-icon>
          <div style="padding: 0">
            <p>
              {{
                tronAddrFromat && tronAddrFromat.length > 0
                  ? tronAddrFromat
                  : $t("wallet.wallet")
              }}
            </p>
            <p style="font-size: 14px; font-weight: 300">
              {{ pnutBalance | amountForm }}
            </p>
          </div>
        </b-nav-item>
        <b-nav-item to="/stake" router-tag="div">
          <b-icon icon="nut-fill"></b-icon>
          {{ $t("stake.stake") }}
        </b-nav-item>
        <b-nav-item to="/farm">
          <b-icon icon="hammer"></b-icon>
          {{ $t("farm.farm") }}
        </b-nav-item>
        <b-nav-item to="/liquid-staking">
          <b-icon icon="tools"></b-icon>
          {{ $t("liquidStaking.liquidStaking") }}
        </b-nav-item>
        <b-nav-item to="/get-vote">
          <b-icon icon="tools"></b-icon>
          {{ $t("vote.upvote") }}
        </b-nav-item>
        <b-nav-item href="https://blog.nutbox.io/" target="_blank">
          <b-icon icon="inbox-fill"></b-icon>
          {{ $t("message.blog") }}
        </b-nav-item>
        <b-nav-item to="/nps">
          <b-icon icon="pencil-fill"></b-icon>
          {{ $t("nps.nps") }}
        </b-nav-item>

        <div class="bottom">
          <div class="links">
            <a href="https://github.com/nutbox-dao" target="_blank">
              <b-icon icon="github"></b-icon>
            </a>
            <a href="https://docs.nutbox.io/" target="_blank">
              <b-icon icon="archive-fill"></b-icon>
            </a>
            <a href="https://discord.com/invite/zPkMuGY" target="_blank">
              <b-icon icon="discord"></b-icon>
            </a>
          </div>

          <div class="settings">
            <b-dd
              id="steem-node"
              :text="$t('message.changeSteemNode')"
              size="sm"
              dropup
              no-caret
            >
              <b-dropdown-item v-for="item in steemUrls" :key="item" @click="selectNode(item)">
                <b-icon
                  :icon="item == currentSteemNode ? 'check' : 'blank'"
                  aria-hidden="true"
                  style="font-size: 20px"
                ></b-icon>
                <span style="font-size: 14px">{{ item }}</span>
              </b-dropdown-item>
            </b-dd>

            <b-dd
              id="language"
              :text="$t('message.language')"
              size="sm"
              dropup
              no-caret
            >
              <b-dropdown-item @click="setenlang">
                <b-icon
                style="font-size: 20px"
                  :icon="lang == 'en' ? 'check' : 'blank'"
                  aria-hidden="true"
                ></b-icon>
                <span style="font-size: 14px">{{ $t("message.en") }}</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setzhlang">
                <b-icon
                style="font-size: 20px"
                  :icon="lang == 'zh' ? 'check' : 'blank'"
                  aria-hidden="true"
                ></b-icon>
                <span style="font-size: 14px">{{ $t("message.zh") }}</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setkrlang">
                <b-icon
                style="font-size: 20px"
                  :icon="lang == 'kr' ? 'check' : 'blank'"
                  aria-hidden="true"
                ></b-icon>
                <span style="font-size: 14px">{{ $t("message.kr") }}</span>
              </b-dropdown-item>
            </b-dd>
          </div>
        </div>
      </b-nav>
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { watchWallet, getTronLinkAddr } from "./utils/chain/tron";
import {
  TRON_LINK_ADDR_NOT_FOUND,
  STEEM_API_URLS,
  STEEM_CONF_KEY,
  LOCALE_KEY,
} from "./config";
import TipMessage from "./components/ToolsComponents/TipMessage";
import { mapState, mapGetters } from "vuex";
import { storeApy } from "./utils/helper";

export default {
  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      steemUrls: STEEM_API_URLS,
      steemNodeKey: STEEM_CONF_KEY,
      currentSteemNode: window.localStorage.getItem(STEEM_CONF_KEY),
      lang: "en",
    };
  },
  computed: {
    ...mapState(["tronAddress"]),
    ...mapGetters(["tronAddrFromat", "pnutBalance"]),
  },
  components: {
    TipMessage,
  },
  methods: {
    setzhlang() {
      this.lang = "zh";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "zh";
    },
    setenlang() {
      this.lang = "en";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "en";
    },
    setkrlang() {
      this.lang = "kr";
      localStorage.setItem(LOCALE_KEY, this.lang);
      this.$i18n.locale = "kr";
    },
    selectNode(node) {
      this.currentSteemNode = node;
      window.localStorage.setItem(this.steemNodeKey, node);
      this.$router.go(0);
    },
  },
  async mounted() {
    var store = this.$store;
    store.dispatch("setVestsToSteem");

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
      store.dispatch("getPnut")
    }
    watchWallet((address) => {
      if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink) {
        this.tipTitle = this.$t("error.needtronlink");
        this.tipMessage = "TronLink: https://www.tronlink.org";
        this.showMessage = true;
      } else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked) {
        this.tipTitle = this.$t("error.error");
        this.tipMessage = this.$t("error.unlockWallet");
        this.showMessage = true;
      } else if (address) {
        store.dispatch("initializeTronAccount", address);
      }
    });
    storeApy();
  },
};
</script>

<style lang="scss">
$blue: #FFDB1B;
:root {
  --yellow-background: #f5ecd8;
  --primary: #FFDB1B;
}

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
html,
body {
  height: 100%;
  margin: 0;
}
#app {
  font-family:PingFangSC-Medium, PingFang SC, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  align-items: left;
}
h3 {
  margin-top: 64px;
  text-align: left;
  display: block;
  width: 100%;
}
.mask {
  z-index: 2000;
  overflow: hidden;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.menu .nav-link {
  display: flex !important;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  svg {
    margin-right: 16px;
  }
  p {
    margin: 0;
    height: 22px;
    line-height: 22px;
  }
}

.logo {
  margin-bottom: 30px;
}

.left {
  background-color: #FFFFFF;
  padding-top: 55px;
  padding-left: 12px;
  width: 240px;
  position: relative;

box-shadow: 4px 0px 48px 0px rgba(0, 0, 0, 0.04);
border-radius: 50px;
box-sizing: border-box;
}
.right {
  background-color: #F6F7F9;
  flex: 1;
  height: 100vh;
  max-height: 100vh;
  min-height: 100vh;
  overflow-y: overlay;
}

.left .nav-item {
  height: 48px;
  text-align: left;
  box-sizing: border-box;
}

.left .nav-item:hover {

background: linear-gradient(270deg, rgba(227, 229, 232, 0) 0%, rgba(227, 229, 232, 0.4) 100%)!important;
font-weight: 500;
color: #242629;
}

.left .nav-item .b-icon {
  margin-right: 6px;
}

.left .nav-link {
  height: 100%;

font-size: 14px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: #BDBFC2;
line-height: 14px;
  padding-left: 36px;
}

.left .active {
background: linear-gradient(270deg, rgba(255, 219, 27, 0) 0%, rgba(255, 219, 27, 0.2) 100%)!important;
  border-radius: 0px;
  border-left: 6px solid var(--primary);
  padding-left: 30px;
font-weight: 500 !important;
color: #242629 !important;
}

.left .bottom {
  position: absolute;
  padding: 0 20px;
  width: 100%;
  bottom: 30px;
  background-color: #fefefe;

  .links {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: space-around;
  }
  .settings {
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
}
.left .bottom a {
  font-size: 1.2rem !important;
}
</style>
