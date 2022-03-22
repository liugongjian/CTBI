<template>
  <div
    style="width:100%;height:100%;display: flex;flex-direction: column;"
    @click="clickHandler"
  >
    <div
      v-show="$optionUtils.getParameter(option, 'Basic.Title.isShow')"
      :style="{color: $optionUtils.getParameter(option, 'Basic.Title.color') || '#333' }"
    >{{ $optionUtils.getParameter(option, 'Basic.Title.text') }}</div>
    <slot v-if="onLoad" />
  </div>
</template>

<script>

export default {
  name: 'ComponentBlock',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      onLoad: false
    }
  },
  mounted () {
    // 防止宽高计算未完成就开始渲染组件
    this.$nextTick(() => {
      this.onLoad = true
    })
  },
  methods: {
    clickHandler () {
      // 通知右侧重新渲染
      this.$bus.$emit('reloadOption', this.option.i)
    }
  }
}
</script>

<style>
</style>
