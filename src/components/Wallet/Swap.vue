<template>
    <div class="wallet-swap" style="margin-top:20px">
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  .tab{
    width: 100%;
    display: flex;
    align-items: left;
    .tab-card{
      margin:20px 14px;
      border-radius: 8px;
      border: 2px dotted var(--yellow-background);
      padding: 10px 16px;
      background-color: white;
      display: flex;
      align-items: center;
      width:160px;
      box-sizing: border-box;
      h5{
        margin-bottom:0;
        margin-left: 10px;
      }
      img{
        width: 30px;
        height: 30px;
      }
    }
    .tab-card:hover{
      cursor: pointer;
      background-color: var(--yellow-background);
    }
    .checked{
      border: 1px solid var(--primary);
    }
  }
}
</style>
