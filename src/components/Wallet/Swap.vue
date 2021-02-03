<template>
    <div class="wallet-swap">
      <template v-if="steemAccount && steemAccount.length > 0">
        <div class="tab">
          <div :class="['tab-card', currentTab === 'steem' ? 'checked' : '']" @click="change('steem')">
            <img src="../../static/images/tsteem.svg" alt="">
            <h5>TSTEEM</h5>
          </div>
          <div :class="['tab-card', currentTab === 'sbd' ? 'checked' : '']" @click="change('sbd')">
            <img src="../../static/images/tsbd.svg" alt="">
            <h5>TSBD</h5>
          </div>
        </div>
        <TSteemSwap v-show="currentTab === 'steem'"/>
        <TSbdSwap v-show="currentTab === 'sbd'"/>
      </template>
      <template v-else>
        <login/>
      </template>
    </div>
</template>

<script>
import Login from '../Login'
import TSteemSwap from './TSteemSwap'
import TSbdSwap from './TSbdSwap'
import { mapState } from 'vuex'
export default {
  name: 'Swap',
  data () {
    return {
      currentTab: 'steem'
    }
  },
  components: {
    Login,
    TSteemSwap,
    TSbdSwap,
  },
  computed: {
    ...mapState(['steemAccount'])
  },
  methods: {
    change (tab) {
      if (tab === 'steem') {
        this.currentTab = 'steem'
      } else if (tab === 'sbd') {
        this.currentTab = 'sbd'
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.wallet-swap {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
@import "../../static/css/tab.less";
}
</style>
