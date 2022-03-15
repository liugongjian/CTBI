<template>
  <div
    class="lazy-load"
    @click.stop="clickHandle"
  >
    <slot v-if="show" />
  </div>
</template>

<script>
export default {
  props: {
    // 延迟时间
    time: {
      type: Number,
      default: 10
    },
    // 是否立即开启延迟渲染
    immediately: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    if (!this.immediately) {
      this.syncLoader()
    }
  },
  methods: {
    /**
     * 延迟渲染
     */
    syncLoader () {
      this.show = false
      setTimeout(() => {
        this.show = true
      }, this.time)
    },
    clickHandle () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
.lazy-load {
  width: 100%;
  height: 100%;
  cursor: pointer;
  box-sizing: border-box;
  touch-action: none;
}
</style>
