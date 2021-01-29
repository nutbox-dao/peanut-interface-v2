<template>
    <div class="steem-wallet">
        <div class="steem-wallet" v-if="steemAccount && steemAccount.trim().length >= 0">
            <!-- 用户名 -->
            <b-dropdown :text="steemAccount" size="lg" lazy block variant="outline-primary" menu-class="w-100">
                <b-dropdown-item-btn @click="logout" size='lg' variant="primary">{{ $t('message.logout') }}</b-dropdown-item-btn>
            </b-dropdown>
            {{ steemBalance | amountForm }}
            {{ sbdBalance | amountForm }}
            {{ spBalance | amountForm }}
        </div>

        <login v-else/>
    </div>
</template>

<script>
import Login from '../Login'
import { mapState, mapGetters } from 'vuex'
import { getKeychain } from '../../utils/chain/steem'

export default {
  name: 'SteemWallet',
  data () {
    return {

    }
  },
  computed: {
      ...mapState(['steemAccount', 'steemBalance', 'sbdBalance']),
      ...mapGetters(['spBalance'])
  },
  methods: {
    async changeAccount (account) {
      this.$store.commit('saveSteemAccount', account)
      console.log(account)
    },
    logout(){
        this.$store.commit('clearSteemAccount')
    }
  },
  components: {
    Login
  },
  async mounted () {
    if (!(await getKeychain())){
      const link = 
            "Chrome: https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm\n\n" +
            "Firefox: https://addons.mozilla.org/en-US/firefox/addon/steem-keychain";
      this.tipTitle = this.$t('error.needkeychain')
      this.tipMessage = link
      this.showMessage = true
    }else{
        if(this.steemAccount && this.steemAccount.trim().length >= 0){
            this.$store.dispatch('initializeSteemAccount',this.steemAccount)
        }
    }
  }
}
</script>

<style lang="less" scoped>

.steem-wallet{
    margin-top:20px;
    // display: flex
}

</style>
