<template>
  <transition name="fade">
    <div class="mask" @click.self="hideMask">
      <Card>
        <h5>{{ isAddStake ? "Stake Tokens" : "Unstake Tokens" }}</h5>
        <div class="input-box">
          <div class="input-title">
            <span>Stake</span>
            <span
              >Balance:{{ isAddStake === "add" ? formBalance : formStaked }}</span
            >
          </div>
          <div class="input-area">
            <input placeholder="0" type="text" v-model="inputValue" />
            <b-button variant="primary" @click="fillMax">
              {{ $t("message.max") }}
            </b-button>
          </div>
        </div>
        <div class="bottom">
          <button @click="cancel">{{ $t("message.cancel") }}</button>
          <button @click="confirm">{{ $t("message.confirm") }}</button>
        </div>
      </Card>
      <TipMessage
        :showMessage="tipMessage"
        :title="tipTitle"
        v-if="showMessage"
        @hideMask="showMessage = false"
      />
    </div>
  </transition>
</template>

<script>
import Card from "../ToolsComponents/Card";
import TipMessage from "../ToolsComponents/TipMessage";
import { getContract } from "../../utils/chain/contract";
import { formatBalance } from "../../utils/helper";

import { amountToInt } from "../../utils/chain/tron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { steemDelegation } from "../../utils/chain/steem";
import { STEEM_MINE_ACCOUNT } from "../../config";
export default {
  name: "ChangeDepositMask",
  data() {
    return {
      isLoading: false,
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      inputValue:''
    };
  },
  components: {
    Card,
    TipMessage,
  },
  computed: {
      formBalance() {
          return formatBalance(0)
      },
      formStaked(){
          return formatBalance(0)
      }
  },
  props: {
    isAddStake: {
      type: Boolean,
      default: true,
    },
    symbol: {
        type: String,
        default: "TSP_POOL"
    }
  },
  methods: {
    hideMask() {
      if (this.isLoading) return;
      this.$emit("hideMask");
    },
    fillMax() {
      this.inputValue =
        this.isAddStake ? this.spBalance : this.delegatedSp;
    },
    async confirm(){

    },
    cancel() {
      this.hideMask();
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
    width: 420px;
    margin-top: -20%;
  }

</style>