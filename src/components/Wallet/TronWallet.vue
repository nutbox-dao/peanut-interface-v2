<template>
    <div class="tron">
      <div class="balance-box">
        <Card>
          <h4>TRON</h4>
          <span>
            {{ tronBalance | amountForm }}
          </span>
        </Card>
        <Card>
          <h4>PNUT</h4>
          <span>
            {{ pnutBalance | amountForm }}
          </span>
        </Card>
        <Card>
          <h4>TSP</h4>
          <span>
            {{ tspBalance | amountForm }}
          </span>
        </Card>
        <Card>
          <h4>TSBD</h4>
          <span>
            {{ tsbdBalance | amountForm }}
          </span>
        </Card>
        <Card>
          <h4>TSTEEM</h4>
          <span>
            {{ tsteemBalance | amountForm }}
          </span>
        </Card>
        <Card>
          <h4>TSP-LP</h4>
          <span>
            {{ tspLpBalance | amountForm }}
          </span>
        </Card>
      </div>
      <TipMessage :showMessage='tipMessage' :title="tipTitle" v-if="showMessage" @hideMask="showMessage=false"/>
    </div>
</template>

<script>
import Card from '../ToolsComponents/Card'
import TipMessage from '../ToolsComponents/TipMessage'
import { mapActions, mapState, mapGetters} from 'vuex'
import { getTronLinkAddr } from '../../utils/chain/tron'
import { TRON_LINK_ADDR_NOT_FOUND } from '../../config'

export default {
  name: 'TronWallet',

  data () {
    return {
      tipMessage:'',
      tipTitle:'',
      showMessage:false,
    }
  },

  computed: {
    ...mapState(['tronAddress']),
    ...mapGetters(['tronBalance','pnutBalance','tsteemBalance','tspBalance', 'tsbdBalance','tspLpBalance'])
  },

  components: {
    Card,
    TipMessage
  },

  methods: {
    ...mapActions(['initializeTronAccount'])
  },

  async mounted () {
    const address = await getTronLinkAddr()
    if (address && address === TRON_LINK_ADDR_NOT_FOUND.noTronLink){
      this.tipTitle = this.$t('error.needtronlink')
      this.tipMessage = "TronLink: https://www.tronlink.org";
      this.showMessage = true
    }else if (address && address === TRON_LINK_ADDR_NOT_FOUND.walletLocked){
      this.tipTitle = this.$t('error.error')
      this.tipMessage = this.$t('error.unlockWallet');
      this.showMessage = true
    }else if (address){
      this.initializeTronAccount(address)
    }
  },
}
</script>

<style lang="less" scoped>
.tron{
  // display: flex;
  // align-items: center;
  // justify-content: space-evenly;
  // flex-wrap: wrap;
  .balance-box{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    span{
      font-size:20px;
    }
  }
  .card{
    width:30%;
    min-width: 200px;
    margin-top: 24px;
  }
}
</style>
