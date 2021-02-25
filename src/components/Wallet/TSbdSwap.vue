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
                src="../../static/images/sbd.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsbd.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px; line-height: 24px">
                {{ fromSteemToTron ? "SBD" : "TSBD" }}
              </span>
            </div>
          </div>
        </div>

        <div class="pink-arrow-box">
          <div style="margin: 0 auto" @click="changeTransOrder">
            <img class="pink-arrow" src="../../static/images/pink-arrow.svg" />
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
                src="../../static/images/tsbd.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/sbd.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px; line-height: 24px">
                {{ fromSteemToTron ? "TSBD" : "SBD" }}
              </span>
            </div>
          </div>
        </div>

        <div class="confirm-box">
          <button v-if="steemAccount && steemAccount.length > 0" class="confirm-btn" @click="trans" :disabled="!canTransFlag">
            <b-spinner
              small
              type="grow"
              v-show="isLoading"
              variant="primary"
              style="margin-right: 8px"
            ></b-spinner>
            {{ $t("message.confirmconvert") }}
          </button>
          <ConnectWalletBtn class='connectSteem' type="STEEM"> </ConnectWalletBtn>
        </div>

        <!--手续费-->
        <p class="tip" v-show="fromSteemToTron">
          {{ $t("message.servicecharge") }}：
          {{ parseFloat(transferRatio * 100).toFixed(2) }}%，{{
            $t("message.atleastcharge")
          }}
          {{ transferFee }} SBD
        </p>
        <!-- 兑换率 -->
        <p class="tip" v-if="fromSteemToTron">
          {{ $t("message.convertrate") }}： 1 SBD = 1 TSBD
        </p>
        <p class="tip" v-else>
          {{ $t("message.convertrate") }}： 1 TSBD = 1 SBD<br />
        </p>
      </div>
    </Card>
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
import ConnectWalletBtn from '../ToolsComponents/ConnectWalletBtn'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import {
  TSBD_TRANSFER_FEE,
  TRANSFER_FEE_RATIO,
  STEEM_DEX_ACCOUNT,
  TRON_CONTRACT_CALL_PARAMS
} from '../../config'
import { isAddress, amountToInt, isTransactionSuccess, isInsufficientEnerge } from '../../utils/chain/tron'
import { getContract } from '../../utils/chain/contract'
import { steemWrap } from '../../utils/chain/steem'
import { formatBalance } from '../../utils/helper'

export default {
  name: 'TSbdSwap',
  components: {
    Card,
    TipMessage,
    ConnectWalletBtn
  },
  data () {
    return {
      fromSteemToTron: true,
      canTransFlag: false,
      isLoading: false,
      transValue: '',
      transferFee: TSBD_TRANSFER_FEE,
      transferRatio: TRANSFER_FEE_RATIO,
      tipMessage: '',
      tipTitle: '',
      showMessage: false,
      showSteemLogin:false
    }
  },
  computed: {
    ...mapState(['sbdBalance', 'steemAccount', 'tronAddress']),
    ...mapGetters(['tsbdBalance']),
    fromTokenBalance () {
      if (this.fromSteemToTron) {
        return formatBalance(this.sbdBalance) + ' SBD'
      } else {
        return formatBalance(this.tsbdBalance) + ' TSBD'
      }
    },
    toTokenBalance () {
      if (!this.fromSteemToTron) {
        return formatBalance(this.sbdBalance) + ' SBD'
      } else {
        return formatBalance(this.tsbdBalance) + ' TSBD'
      }
    },
    transFee () {
      if (this.fromSteemToTron) {
        const f = parseFloat(this.transValue) * TRANSFER_FEE_RATIO
        return f > TSBD_TRANSFER_FEE ? f : TSBD_TRANSFER_FEE
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getSbd', 'getTsbd']),
    ...mapMutations(['saveSbdBalance', 'saveTsbdBalanceInt']),

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
          parseFloat(parseFloat(this.sbdBalance) - this.transFee).toFixed(3)

        this.canTransFlag = res1 && res && res2
      } else {
        const res3 =
          parseFloat(this.transValue) <= parseFloat(this.tsbdBalance)
        this.canTransFlag = res1 && res && res3
      }
    },

    changeTransOrder () {
      this.fromSteemToTron = !this.fromSteemToTron
      this.transValue = ''
      this.checkTransValue()
    },

    fillMaxTrans () {
      if (this.fromSteemToTron) {
        this.transValue = this.sbdBalance
        this.transValue = parseFloat(this.sbdBalance - this.transFee)
      } else {
        this.transValue = parseFloat(this.tsbdBalance)
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
        this.sbdToTsbd()
      } else {
        this.tsbdToSbd()
      }
    },

    async sbdToTsbd () {
      try {
        const amount = parseFloat(this.transValue).toFixed(3)
        const res = await steemWrap(
          this.steemAccount,
          STEEM_DEX_ACCOUNT,
          amount,
          this.tronAddress + ' +' + amount + ' TSBD',
          'SBD',
          this.tronAddress,
          this.transFee
        )
        if (res.success === true) {
          const tsbdBalance = parseFloat(this.tsbdBalance)
          const sbdBalance = parseFloat(this.sbdBalance)
          this.saveTsbdBalanceInt(amountToInt(tsbdBalance + parseFloat(amount)))
          this.saveSbdBalance(sbdBalance - parseFloat(amount) - parseFloat(this.transFee))
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

    async tsbdToSbd () {
      try {
        const contract = await getContract('TSBD')
        let amount = parseFloat(this.transValue).toFixed(3)
        amount = amountToInt(amount)
        const res = await contract
          .tsbdToSbd(this.steemAccount, amount)
          .send(TRON_CONTRACT_CALL_PARAMS)
        if (res && (await isTransactionSuccess(res))) {
          this.saveTsbdBalanceInt(amountToInt(parseFloat(this.tsbdBalance) - parseFloat(amount)))
          this.saveSbdBalance(parseFloat(this.sbdBalance) + parseFloat(amount))
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
    if (this.steemAccount && this.steemAccount.length > 0) {
      this.getSbd()
      this.getTsbd()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../static/css/swap.less";

</style>
