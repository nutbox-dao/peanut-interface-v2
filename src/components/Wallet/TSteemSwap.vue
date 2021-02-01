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
              :class="canTransFlag ? 'isok' : 'isfalse'"
              placeholder="0.0"
              v-model="transValue"
              @keyup="checkTransValue"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex;align-content:center;">
              <button class="maxBtn" @click="fillMaxTrans">Max</button>
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/tsteem.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px;line-height:24px">
                {{ fromSteemToTron ? "STEEM" : "TSTEEM" }}
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
              :class="canTransFlag ? 'isok' : 'isfalse'"
              placeholder="0.0"
              v-model="transValue"
              @keyup="checkTransValue"
              inputmode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              spellcheck="false"
              value
            />
            <div style="display: flex;align-content:center;">
              <img
                class="coin-icon"
                src="../../static/images/tsteem.svg"
                alt=""
                v-if="fromSteemToTron"
              />
              <img
                class="coin-icon"
                src="../../static/images/steem.svg"
                alt=""
                v-else
              />
              <span style="margin-left: 8px;line-height:24px">
                {{ fromSteemToTron ? "TSTEEM" : "STEEM" }}
              </span>
            </div>
          </div>
        </div>

        <div class="confirm-box">
          <button class="confirm-btn" @click="trans" :disabled="!canTransFlag">
            <b-spinner
              small
              type="grow"
              v-show="isLoading"
              variant="primary"
            ></b-spinner>
            {{ $t("message.confirmconvert") }}
          </button>
        </div>

        <!--手续费-->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-show="fromSteemToTron"
        >
          {{ $t("message.servicecharge") }}： {{ parseFloat(transferRatio*100).toFixed(2) }}%，{{
            $t("message.atleastcharge")
          }}
          {{ transferFee }} STEEM
        </p>
        <!-- 兑换率 -->
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-if="fromSteemToTron"
        >
          {{ $t("message.convertrate") }}： 1 STEEM = 1 TSTEEM
        </p>
        <p
          style="
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
            margin: 0;
            padding-top: 8px;
          "
          v-else
        >
          {{ $t("message.convertrate") }}： 1 TSTEEM= 1 STEEM<br />
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from '../ToolsComponents/Card'
import { mapState, mapGetters, mapActions } from 'vuex'
import { TSTEEM_TRANSFER_FEE, TRANSFER_FEE_RATIO } from '../../config'

export default {
  name: 'TSteemSwap',
  components: {
    Card
  },
  data () {
    return {
      fromSteemToTron: true,
      canTransFlag: false,
      isLoading: false,
      transValue: '',
      transferFee: TSTEEM_TRANSFER_FEE,
      transferRatio: TRANSFER_FEE_RATIO
    }
  },
  computed: {
    ...mapState(['steemBalance', 'sbdBalance', 'steemAccount']),
    ...mapGetters(['tsteemBalance', ' tsbdBalance']),
    fromTokenBalance () {
      if (this.fromSteemToTron) {
        return this.formatBalance(this.steemBalance) + ' STEEM'
      } else {
        return this.formatBalance(this.tsteemBalance) + ' TSTEEM'
      }
    },
    toTokenBalance () {
      if (!this.fromSteemToTron) {
        return this.formatBalance(this.steemBalance) + ' STEEM'
      } else {
        return this.formatBalance(this.tsteemBalance) + ' TSTEEM'
      }
    },
    transFee () {
      if (this.fromSteemToTron) {
        const f = parseFloat(this.steemBalance) * TRANSFER_FEE_RATIO
        return f > TSTEEM_TRANSFER_FEE ? f : TSTEEM_TRANSFER_FEE
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getSteem', 'getTsteem']),
    checkTransValue () {
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
          parseFloat(this.transValue) <= parseFloat(this.tsteemBalance)
        this.canTransFlag = res1 && res && res3
      }
    },
    changeTransOrder () {
      this.fromSteemToTron = !this.fromSteemToTron
      this.transValue = ''
      this.checkTransValue()
    },
    formatBalance (value, digit = 3) {
      if (!value) return ''
      const str =
        digit != null && digit >= 0
          ? Number(value).toFixed(digit).toString()
          : value.toString()
      let integer = str
      let fraction = ''
      if (str.includes('.')) {
        integer = str.split('.')[0]
        fraction = '.' + str.split('.')[1]
      }
      return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
    },
    fillMaxTrans () {
      if (this.fromSteemToTron) {
        this.transValue = parseFloat(this.steemBalance - this.transFee).toFixed(3)
      } else {
        this.transValue = parseFloat(this.tsteemBalance).toFixed(3)
      }
      this.checkTransValue()
    },

    trans () {
      this.isLoading = true
    }
  },
  mounted () {
    if (this.steemAccount && this.steemAccount.length > 0) {
      this.getSteem()
      this.getTsteem()
    }
  }
}
</script>

<style lang="less" scoped>
.swap-field {
  margin-top: 48px;
  .box {
    width: 480px;
    padding-top: 20px;
    .round-box {
      border-radius: 20px;
      border: 1px solid rgb(247, 248, 250);
      padding: 8px 14px;
      margin-top: 1em;
      margin-bottom: 1em;
    }
    .box-title-container {
      display: flex;
      justify-content: space-between;
      span {
        font-weight: 500;
        font-size: 14px;
      }
    }
    .box-content-container {
      display: flex;
      flex-flow: row nowrap;
      -webkit-box-align: center;
      align-items: center;
      align-content: center;
      color: rgb(0, 0, 0);
      font-size: 1rem;
      line-height: 1.2rem;
      box-sizing: border-box;
      padding-top: 36px;
      justify-content: space-between;
      -webkit-box-pack: justify;
      height: 100%;
    }
    .input {
      color: rgb(0, 0, 0);
      width: 100%;
      position: relative;
      font-weight: 500;
      outline: none;
      border: none;
      flex: 1 1 auto;
      background-color: rgb(255, 255, 255);
      font-size: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0px;
      appearance: textfield;
    }
    .maxBtn {
      height: 100%;
      background-color: rgb(253, 234, 241);
      border: 1px solid rgb(253, 234, 241);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      margin-right: 0.5rem;
      color: rgb(255, 0, 122);
      user-select: none;
    }

    .maxBtn:focus {
      border: 1px solid rgb(255, 0, 122);
      outline: none;
    }

    .maxBtn:hover {
      border: 1px solid rgb(255, 0, 122);
    }
    .pink-arrow-box {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      align-content: center;
      width: 100%;
      text-align: center;
    }
    .coin-icon {
      width: 24px;
      height: 24px;
    }

    .pink-arrow {
      cursor: pointer;
    }

.confirm-box {
  margin-top: 1em;
  display: flex;
  justify-content: space-around;
}

.confirm-btn {
  padding: 12px;
  /* width: 100%; */
  flex: 1;
  text-align: center;
  border-radius: 20px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background-color: rgb(253, 234, 241);
  color: rgb(255, 0, 122);
  font-size: 16px;
  font-weight: 500;
  user-select: none;
}

.confirm-btn:hover {
  background-color: rgb(251, 220, 230);
}

.confirm-btn:disabled {
  color: rgb(136, 141, 155);
  cursor: auto;
  box-shadow: none;
  outline: none;
  opacity: 1;
  background-color: rgb(237, 238, 242);
}

  }
}
</style>
