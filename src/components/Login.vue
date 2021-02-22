<template>
  <div class="steem-login" @click.self="hideMask">
    <div class="login">
      <Card>
        <h4>{{ this.$t("message.userlogin") }}</h4>
        <div class="input">
          <img src="../static/images/keychain.png" alt="" />
          <b-input
            class="mb-2 mr-sm-2 mb-sm-0 user"
            :placeholder="$t('message.steemAccoutPlaceHolder')"
            v-model="steemAccount"
          ></b-input>
        </div>
        <b-button variant="outline-primary" @click="login" :disabled="isLoging">
          <b-spinner
            small
            type="grow"
            v-show="isLoging"
            variant="primary"
          ></b-spinner>
          {{ this.loginBtnText }}
        </b-button>
      </Card>
    </div>
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
      :canDiss="canDismissTip"
    />
  </div>
</template>

<script>
import Card from "./ToolsComponents/Card";
import TipMessage from "./ToolsComponents/TipMessage";

export default {
  name: "Login",
  data() {
    return {
      loginBtnText: "",
      isLoging: false,
      showNeedKeyChain: false,
      steemAccount: "",
      tipTitle: "",
      tipMessage: "",
      showMessage: false,
      canDismissTip: true,
    };
  },
  components: {
    Card,
    TipMessage,
  },
  methods: {
    showKeyChainNeeded() {},
    login() {
      const message = `nutbox_login-${Math.floor(
        100000000 + Math.random() * 900000000
      )}`;
      this.isLoging = true;
      const that = this;
      steem_keychain.requestSignBuffer(
        this.steemAccount,
        message,
        "Active",
        async function (res) {
          console.log(res);
          if (res.success === true) {
            const ress = await that.$store.dispatch(
              "initializeSteemAccount",
              res.data.username
            );
            if (!ress) {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t("error.steemLoginFail");
              that.showMessage = true;
              that.isLoging = false;
              return;
            }
            that.$emit("hideMask");
          } else {
            if (res.error === "user_cancel") {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t("error.unlockKeychain");
              that.showMessage = true;
            } else {
              that.tipTitle = that.$t("error.error");
              that.tipMessage = that.$t("error.steemLoginFail");
              that.showMessage = true;
            }
          }
          that.isLoging = false;
        }
      );
    },
    hideMask() {
      if (this.isLoging) return;
      this.$emit("hideMask");
    },
  },
  async mounted() {
    this.loginBtnText = this.$t("message.login");
  },
};
</script>

<style lang="less" scoped>
.steem-login {
  position: fixed;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  .login {
    margin-top: -15%;
  }
  .input {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 480px;
    min-width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    .user {
      flex: 1;
      margin-left: 20px;
    }
  }
}
</style>
