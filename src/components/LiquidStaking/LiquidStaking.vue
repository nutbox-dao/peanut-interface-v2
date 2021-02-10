<template>
    <div class="liquid-staking">
        <h3>{{ $t('liquidStaking.liquidStaking') }}</h3>
        <router-view v-if="$store.state.steemAccount"></router-view>
        <Login v-else/>
    </div>
</template>

<script>
import Login from '../Login'
export default {
  name: 'LiquidStaking',
  components: {
    Login
  }
}
</script>

<style lang="less" scoped>
    .liquid-staking{
        padding: 0px 40px 64px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }
</style>
