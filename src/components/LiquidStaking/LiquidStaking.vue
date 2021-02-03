<template>
    <div class="liquid-staking">
        <h3>{{ $t('liquidStaking.liquidStaking') }}</h3>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'LiquidStaking'
    }
</script>

<style lang="less" scoped>
    .liquid-staking{
        padding: 0px 40px 64px;

    }
</style>