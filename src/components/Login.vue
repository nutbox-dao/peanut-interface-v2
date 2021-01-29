<template>
    <div class="steem-login">
        <div class="login">
            <Card>
                <h4>{{ this.$t('message.userlogin') }}</h4>
                <div class="input">
                    <img src="../static/images/keychain.png" alt="">
                    <b-input
                    class="mb-2 mr-sm-2 mb-sm-0 user"
                    :placeholder="$t('message.steemAccoutPlaceHolder')"
                    v-model="steemAccount"
                    ></b-input>
                </div>
                <b-button variant="outline-primary" @click="login" :disabled="isLoging">
                    <b-spinner small type="grow" v-show="isLoging" variant="primary"></b-spinner>
                    {{ this.loginBtnText }}
                </b-button>
            </Card>
        </div>
        <TipMessage :showMessage='tipMessage' :title="tipTitle" v-if="showMessage" @hideMask="showMessage=false" :canDiss="canDismissTip"/>

    </div>
</template>

<script>
import Card from './ToolsComponents/Card'
import TipMessage from './ToolsComponents/TipMessage'

export default {
  name: 'Login',
  data () {
    return {
      loginBtnText: '',
      isLoging: false,
      showNeedKeyChain: false,
      steemAccount: '',
      tipTitle:'',
      tipMessage: '',
      showMessage: false,
      canDismissTip: true
    }
  },
  components: {
    Card,
    TipMessage
  },
  methods: {
    showKeyChainNeeded () {

    },
    login () {
      const message = `nutbox_login-${Math.floor(
                                100000000 + Math.random() * 900000000
                                )}`
      this.isLoging = true
      const that = this
      steem_keychain.requestSignBuffer(this.steemAccount, message, 'Active', async function (res) {
        console.log(res)
        if (res.success === true) {
          const ress = await that.$store.dispatch('initializeSteemAccount', res.data.username)
          if (!ress){
            that.tipTitle = that.$t('error.error')
            that.tipMessage = that.$t('error.steemLoginFail')
            that.showMessage = true
          }
        } else {
          if (res.error === 'user_cancel'){
            that.tipTitle = that.$t('error.error')
            that.tipMessage = that.$t('error.unlockKeychain')
            that.showMessage = true
          }else{
            that.tipTitle = that.$t('error.error')
            that.tipMessage = that.$t('error.steemLoginFail')
            that.showMessage = true
          }
        }
        that.isLoging = false
      })
    }
  },
  async mounted () {
    this.loginBtnText = this.$t('message.login')
  }
}
</script>

<style lang="less" scoped>
.steem-login{
    display: flex;
    justify-content: center;
    align-items: center;
    height:calc(100vh - 500px)
}
.input{
    margin-top: 2rem;
    margin-bottom:2rem;
    width:50vw;
    min-width:320px;
    display: flex;
    align-items: center;
    justify-content: center;
    .user{
        flex: 1;
        margin-left: 20px;
    }
}
</style>
