<template>
    <div class="steem-wallet">
        <div class="steem-wallet" v-if="!$store.state.steemAccount">
            <!-- 用户名 -->
            <b-dropdown :text="$store.state.steemAccount" size="lg" lazy block variant="outline-primary" menu-class="w-100">
                <b-dropdown-item-btn @click="changeAccout('nice')" size='lg' variant="primary">Action</b-dropdown-item-btn>
            </b-dropdown>

        </div>

        <login v-else/>
    </div>
</template>

<script>
import Login from '../Login'

export default {
  name: 'SteemWallet',
  data () {
    return {

    }
  },
  methods: {
    async changeAccout (account) {
      this.$store.commit('saveSteemAccount', account)
      console.log(account)
    }
  },
  components: {
    Login
  },
  mounted () {
    if (window.steem_keychain) {

    }
    this.$store.commit('saveSteemAccount', 'terry3t')
  }
}
</script>

<style lang="less" scoped>

.steem-wallet{
    margin-top:20px;
    // display: flex
}

</style>
