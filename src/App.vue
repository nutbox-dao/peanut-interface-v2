<template>
  <div id="app">
    <div class="left">
      <img src="./static/images/logo.svg" alt="nutbox" class="logo" />
      <b-nav pills vertical align="center" class="menu">
        <b-nav-item to="/wallet">
          <b-icon icon="person-fill"></b-icon>
          <div style="padding:0;">
            <p>
              {{
                tronAddrFromat && tronAddrFromat.length > 0
                  ? tronAddrFromat
                  : $t("wallet.wallet")
              }}
            </p>
            <p style="font-size:14px;font-weight:300">
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
        <b-nav-item to="/nps">
          <b-icon icon="pencil-fill"></b-icon>
          {{ $t("nps.nps") }}
        </b-nav-item>

        <p style="height: 20px"></p>
        <b-nav-item> </b-nav-item>
        <div class="bottom">
          <a href="https://github.com/nutbox-dao" target="_blank">
            <b-icon icon="github"></b-icon>
          </a>
          <a href="https://docs.nutbox.io/" target="_blank">
            <b-icon icon="archive-fill"></b-icon>
          </a>
          <a href="https://discord.com/invite/zPkMuGY" target="_blank">
            <b-icon icon="discord"></b-icon>
          </a>
          <a href="https://blog.nutbox.io/" target="_blank">
            <b-icon icon="inbox-fill"></b-icon>
          </a>
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
import { TRON_LINK_ADDR_NOT_FOUND } from "./config";
import TipMessage from "./components/ToolsComponents/TipMessage";
import { mapState, mapGetters, mapMutations } from "vuex";
import { storeApy } from "./utils/helper"

export default {
  data() {
    return {
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
    };
  },
  computed: {
    ...mapState(["tronAddress"]),
    ...mapGetters(["tronAddrFromat", "pnutBalance"]),
  },
  components: {
    TipMessage,
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
      store.dispatch("initializeTronAccount", address);
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
    storeApy(store)
  },
};
</script>

<style lang="scss">
$blue: #f4a921;
:root {
  --yellow-background: #f5ecd8;
  --primary: #f4a921;
}

@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
html,
body {
  height: 100%;
  margin: 0;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
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
  background-color: #fefefe;
  padding-top: 64px;
  width: 240px;
  position: relative;
  box-shadow: 0 0 16px #eee;
}
.right {
  background-color: #fefefa;
  flex: 1;
  height: 100vh;
  max-height: 100vh;
  min-height: 100vh;
  overflow-y: overlay;
}

.left .nav-item {
  height: 60px;
  font-size: 1.1rem;
  text-align: left;
  box-sizing: border-box;
}

.left .nav-item:hover {
  background-color: var(--yellow-background) !important;
}

.left .nav-item .b-icon {
  margin-right: 6px;
}

.left .nav-link {
  height: 100%;
  line-height: 44px;
  color: var(--primary) !important;
  padding-left: 24px;
}

.left .active {
  background-color: var(--yellow-background) !important;
  border-radius: 0px;
}

.left .bottom {
  position: absolute;
  padding: 0 40px;
  width: 100%;
  bottom: 30px;
  background-color: #fefefe;
  display: flex;
  justify-content: center;
  justify-content: space-around;
}
.left .bottom a {
  font-size: 1.2rem !important;
}
</style>
