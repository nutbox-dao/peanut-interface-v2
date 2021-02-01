<template>
  <div class="swap-field">
    <Card>
      <div class="box">
        <div class="round-box">
          <div class="box-title-container">
            <span>from</span>
            <span>{{
              $t("message.balance") + ':'
            }}</span>
          </div>
          <div class="box-content-container">

          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from '../ToolsComponents/Card'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TbdSwap',
  components: {
    Card
  },
  data () {
    return {
      fromSteemToTron: true
    }
  },
  computed: {
    ...mapState(['steemBalance', 'sbdBalance']),
    ...mapGetters(['tsteemBalance', ' tsbdBalance'])
  },
  filters: {
    uppercase: function (value) {
      return value.toUpperCase()
    }
  },
  methods: {
    checkInput () {}
  },
  mounted () {
    console.log('loooog')
  }
}
</script>

<style lang="less" scoped>
.swap-field {
  margin-top: 48px;
  .box {
    width: 400px;
    padding-top: 30px;
    h4 {
      margin-bottom: 20px;
    }
    .round-box {
      border-radius: 20px;
      border: 1px solid rgb(247, 248, 250);
      padding: 8px 14px;
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
    }
  }
}
</style>
