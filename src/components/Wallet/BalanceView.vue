<template>
  <div>
    <Card>
      <div class="top">
        <img :src="logo" alt="" class="icon" />
        <div class="balance-right">
          <div class="balance-name">
            <span class="title">
              {{ name }}
            </span>
            <span style="font-size: 14px; color: #999">
              {{ desc }}
            </span>
          </div>
          <div class="balance">
            <span class="title">
              {{ balances | amountForm }}
            </span>
          </div>
        </div>
      </div>
      <ConnectWalletBtn :type="walletType" @steemLogin="showSteemLogin=true"> </ConnectWalletBtn>
    </Card>
      <Login v-if="showSteemLogin" @hideMask="showSteemLogin=false"/>
  </div>
</template>

<script>
import Card from "../ToolsComponents/Card";
import Login from '../Login'
import ConnectWalletBtn from "../ToolsComponents/ConnectWalletBtn";

export default {
  name: "BalanceView",
  data() {
    return {
      showSteemLogin:false,
    };
  },
  props: {
    name: {
      type: String,
      default: "TRON",
    },
    balances: {
      type: String,
      default: "0.00",
    },
    logo: {
      type: String,
      default: "",
    },
    walletType: {
      type: String,
      default: "STEEM", // 0:steem  1: tron
    },
    desc: {
      type: String,
      default: "STEEM",
    },
  },
  components: {
    Card,
    ConnectWalletBtn,
    Login
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 30%;
  min-width: 320px;
  .top {
    margin: 0;
    padding: 0;
    display: flex;
    .icon {
      width: 48px;
      height: 48px;
      margin-right: 10px;
    }
    .balance-right {
      display: flex;
      flex: 1;
      align-content: center;
      justify-content: space-between;
      span {
        text-align: left;
      }
      .title {
        font-size: 18px;
      }
      .balance-name {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }
    }
  }
  button {
    width: 90% !important;
  }
}
</style>