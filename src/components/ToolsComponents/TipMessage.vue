<template>
    <transition name="fade">
        <div class="mask" @click="hideMask">
            <div class="mask-box">
                <div class="mask-info">
                    <h5 v-if="title && title.trim().length > 0">{{ title }}</h5>
                    <p class="mask-info-text">
                        {{ showMessage }}
                    </p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  methods: {
    hideMask () {
      if (!this.canDiss) {
        return
      }
      this.$emit('hideMask')
    }
  },
  props: {
    title: {
        type: String,
    },
    showMessage: {
      type: String,
      default: 'error'
    },
    canDiss: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.mask {
  z-index: 2000;
  overflow: hidden;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.mask-box {
  position: relative;
  max-width: 380px;
  width: 100%;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 30px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
    rgba(0, 0, 0, 0.04) 3px 16px 24px, rgba(0, 0, 0, 0.01) 3px 24px 32px;
  border-radius: 10px;
  padding: 1rem;
  display: block;
  z-index: 100;
  box-sizing: border-box;
  margin-top: -50vh;
}

.mask-info {
  align-content: center;
  p{
      width: 100%;
      word-wrap: break-word;
      margin-bottom:0;
  }
}

.mask-info-text {
  text-align: center;
  width: 100%;
}
</style>
