<template>
    <div class="tron">
      <p>tronaddre: {{ tronAddress }}</p>
      <p/>
      <p>tron:{{ tronBalance | amountForm }}</p> <br/>
      <p>tsteem:{{ tsteemBalance | amountForm }}</p> <br/>
      <p>tsp:{{ tspBalance | amountForm }}</p> <br/>
      <p>tsbd:{{ tsbdBalance | amountForm }}</p> <br/>
      <p>tsplp:{{ tspLpBalance | amountForm }}</p> <br/>
      <p>pnut:{{ pnutBalance | amountForm }}</p>

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
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  >p{
    width:90%;
  }
}
</style>
