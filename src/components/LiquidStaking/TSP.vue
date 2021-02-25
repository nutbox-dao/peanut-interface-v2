<template>
  <div class="swap-field">
    <Card>
      <div class="box">
        <div class="round-box">
          <div class="box-title-container">
            <span>from</span>
            <span>{{ $t("message.balance") + ": " + fromTokenBalance }} </span>
          </div>
          <div class="box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              placeholder="0.0"
              v-model="transValue"
              @keyup="checkTransValue"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex; align-content: center">
              <button class="maxBtn" @click="fillMaxTrans">Max</button>
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsp.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px; line-height: 24px">
                {{ fromSteemToTron ? "STEEM" : "TSP" }}
              </span>
            </div>
          </div>
        </div>

        <div class="pink-arrow-box">
          <div style="margin: 0 auto">
            <img class="pink-arrow" src="../../static/images/down-arrow.svg" />
          </div>
        </div>

        <div class="round-box">
          <div class="box-title-container">
            <span>to</span>
            <span>{{ $t("message.balance") + ": " + toTokenBalance }} </span>
          </div>
          <div class="box-content-container">
            <input
              class="mb-2 mr-sm-2 mb-sm-0 user input"
              placeholder="0.0"
              v-model="transValue"
              @keyup="checkTransValue"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex; align-content: center">
              <img
                class="coin-icon"
                src="../../static/images/tsp.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px; line-height: 24px">
                {{ fromSteemToTron ? "TSP" : "STEEM" }}
              </span>
            </div>
          </div>
        </div>

        <div class="confirm-box">
          <button class="confirm-btn" v-if="isLogin" @click="trans" :disabled="!canTransFlag">
            <b-spinner
              small
              type="grow"
              v-show="isLoading"
              variant="primary"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("message.confirmconvert") }}
          </button>
          <ConnectWalletBtn v-else type="STEEM" @steemLogin="showSteemLogin=true"/>
        </div>

        <!--手续费-->
        <p class="tip" v-show="fromSteemToTron">
          {{ $t("message.servicecharge") }}：
          {{ parseFloat(transferRatio * 100).toFixed(2) }}%，{{
            $t("message.atleastcharge")
          }}
          {{ transferFee }} STEEM
        </p>
        <!-- 兑换率 -->
        <p class="tip" v-if="fromSteemToTron">
          {{ $t("message.convertrate") }}： 1 STEEM = 1 TSP
        </p>
        <p class="tip" v-else>
          {{ $t("message.convertrate") }}： 1 TSP = 1 STEEM<br />
        </p>
        <p class="tip" v-show="!fromSteemToTron">
          {{ $t("liquidStaking.tsp.tsptosteemintro") }}
        </p>
      </div>
    </Card>
    <Login v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
  </div>
</template>

<script>
import Card from '../ToolsComponents/Card'
import TipMessage from '../ToolsComponents/TipMessage'
import Login  from '../Login'
import ConnectWalletBtn from '../ToolsComponents/ConnectWalletBtn'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import {
  STEEM_TO_TSP_FEE,
  STEEM_TO_TSP_FEE_RATIO,
  STEEM_TSP_ACCOUNT,
  TRON_CONTRACT_CALL_PARAMS
} from '../../config'
import { isAddress, amountToInt, isTransactionSuccess, isInsufficientEnerge } from '../../utils/chain/tron'
import { getContract } from '../../utils/chain/contract'
import { steemTransferVest } from '../../utils/chain/steem'
import { formatBalance } from '../../utils/helper'

export default {
  name: 'TSP',
  components: {
    Card,
    TipMessage,
    ConnectWalletBtn,
    Login
  },
  props: {
    fromSteemToTron: {
      type: Boolean,
      default:true 
    },
  },
  data () {
    return {
      canTransFlag: false,
      isLoading: false,
      transValue: '',
      transferFee: STEEM_TO_TSP_FEE,
      transferRatio: STEEM_TO_TSP_FEE_RATIO,
      tipMessage: '',
      tipTitle: '',
      showMessage: false,
      showSteemLogin: false,
    }
  },
  computed: {
    ...mapState(['steemBalance', 'steemAccount', 'tronAddress']),
    ...mapGetters(['tspBalance']),
    fromTokenBalance () {
      if (this.fromSteemToTron) {
        return formatBalance(this.steemBalance) + ' STEEM'
      } else {
        return formatBalance(this.tspBalance) + ' TSP'
      }
    },
    toTokenBalance () {
      if (!this.fromSteemToTron) {
        return formatBalance(this.steemBalance) + ' STEEM'
      } else {
        return formatBalance(this.tspBalance) + ' TSP'
      }
    },
    transFee () {
      if (this.fromSteemToTron) {
        const f = parseFloat(this.transValue) * STEEM_TO_TSP_FEE_RATIO
        return f > STEEM_TO_TSP_FEE ? f : STEEM_TO_TSP_FEE
      }
      return 0
    },
    isLogin(){

      return this.steemAccount && this.steemAccount.length > 0
    }
  },

  methods: {
    ...mapActions(['getSteem', 'getTsp']),
    ...mapMutations(['saveSteemBalance', 'saveTspBalanceInt']),

    checkTransValue () {
      this.isLoading = false
      const reg = /^\d+(\.\d+)?$/
      const res = reg.test(this.transValue)
      let res1 = false
      if (parseFloat(this.transValue) > 0) {
        res1 = true
      }
      if (this.fromSteemToTron) {
        const res2 =
          parseFloat(this.transValue) <=
          parseFloat(parseFloat(this.steemBalance) - this.transFee).toFixed(3)

        this.canTransFlag = res1 && res && res2
      } else {
        const res3 =
          parseFloat(this.transValue) <= parseFloat(this.tspBalance)
        this.canTransFlag = res1 && res && res3
      }
    },

    fillMaxTrans () {
      if (this.fromSteemToTron) {
        this.transValue = this.steemBalance
        this.transValue = parseFloat(this.steemBalance - this.transFee)
      } else {
        this.transValue = parseFloat(this.tspBalance)
      }
      this.checkTransValue()
    },

    trans () {
      if (!isAddress(this.tronAddress)) {
        this.tipTitle = this.$t('error.error')
        this.tipMessage = this.$t('error.illegalTronAddress')
        this.showMessage = true
        return
      }
      this.isLoading = true
      this.canTransFlag = false
      if (this.fromSteemToTron) {
        this.steemToTsp()
      } else {
        this.tspToSteem()
      }
    },

    async steemToTsp () {
      try {
        const amount = parseFloat(this.transValue).toFixed(3)
        const res = await steemTransferVest(
          this.steemAccount,
          STEEM_TSP_ACCOUNT,
          amount,
          this.tronAddress,
          this.transFee
        )
        if (res.success === true) {
          const tspBalance = parseFloat(this.tspBalance)
          const steemBalance = parseFloat(this.steemBalance)
          this.saveTspBalanceInt(amountToInt(tspBalance + parseFloat(amount)))
          this.saveSteemBalance(steemBalance - parseFloat(amount) - parseFloat(this.transFee))
        } else {
          this.tipTitle = this.$t('error.error')
          this.tipMessage = res.message
          this.showMessage = true
        }
      } catch (e) {
        this.tipTitle = this.$t('error.error')
        this.tipMessage = e.message
        this.showMessage = true
      } finally {
        this.transValue = ''
        this.checkTransValue()
      }
    },

    async tspToSteem () {
      try {
        const contract = await getContract('TSP')
        let amount = parseFloat(this.transValue).toFixed(3)
        amount = amountToInt(amount)
        const res = await contract
          .tspToSteem(this.steemAccount, amount)
          .send(TRON_CONTRACT_CALL_PARAMS)
        if (res && (await isTransactionSuccess(res))) {
          this.saveTspBalanceInt(amountToInt(parseFloat(this.tspBalance) - parseFloat(amount)))
          this.saveSteemBalance(parseFloat(this.steemBalance) + parseFloat(amount))
        } else {
          if (res && (await isInsufficientEnerge(res))) {
            this.tipMessage = this.$t('error.insufficientEnerge')
          } else {
            this.tipMessage = this.$t('error.transferFail')
          }
          this.tipTitle = this.$t('error.error')
          this.showMessage = true
        }
      } catch (e) {
        this.tipTitle = this.$t('error.error')
        this.tipMessage = e.message
        this.showMessage = true
      } finally {
        this.transValue = ''
        this.checkTransValue()
      }
    }
  },
  mounted () {
    console.log(23542,this.fromSteemToTron);
    if (this.steemAccount && this.steemAccount.length > 0) {
      this.getSteem()
      this.getTsp()
    }
  }
}
</script>

<style lang="less" scoped>
// .swap-field {
//     display: flex;
//     justify-content:space-around;
// }
@import "../../static/css/swap.less";

</style>
