<template>
    <div class='card'>
        <slot/>
    </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style lang="less" scoped>
.card{
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 10px, rgba(0, 0, 0, 0.03) 0px 2px 4px,
    rgba(0, 0, 0, 0.03) 3px 8px 12px, rgba(0, 0, 0, 0.01) 3px 12px 16px;
    border-radius: 16px;
    display: block;
    z-index: 1;
    box-sizing: border-box;
    padding:1.5rem 1rem 1.5rem 1rem;
}
.card:hover{
    box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
}
</style>
