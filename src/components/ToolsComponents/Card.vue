<template>
    <div class='card'>
        <slot/>
    </div>
</template>

<script>
export default {
    name:'Card'
}
</script>

<style lang="less" scoped>
.card{
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
    border-radius: 30px;
    display: block;
    z-index: 1;
    box-sizing: border-box;
    padding:1.5rem 1rem 2rem 1rem;
}
</style>
