<template>
    <div class="wallet-swap">
      <div class="tab">
        <div :class="['tab-card', currentTab === 'tsteem' ? 'checked' : '']" @click="change('tsteem')">
          <img src="../../static/images/tsteem.svg" alt="">
          <h5>TSTEEM</h5>
        </div>
        <div :class="['tab-card', currentTab === 'tsbd' ? 'checked' : '']" @click="change('tsbd')">
          <img src="../../static/images/tsbd.svg" alt="">
          <h5>TSBD</h5>
        </div>
      </div>
      <SwapField :tokenType="currentTab"/>
    </div>
</template>

<script>
import Card from '../ToolsComponents/Card'
import SwapField from './SwapField'
export default {
  name: 'Swap',
  data () {
    return {
      currentTab: 'tsteem',

    }
  },
  components: {
    Card,
    SwapField
  },
  methods: {
    change (tab){
      if (tab === 'tsteem'){
        this.currentTab = 'tsteem'
      }else if (tab === 'tsbd'){
        this.currentTab = 'tsbd'
      }
    }
  },
  mounted () {
    ;
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
