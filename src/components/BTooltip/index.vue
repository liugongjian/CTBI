<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    :effect="effect"
    :disabled="!isShowTooltip"
  >
    <span
      class="ellipsis-text"
      :style="{width: width}"
      @mouseenter="visibilityChange($event)"
      v-html="content"
    />
  </el-tooltip>
</template>

<script>
/**
 * 文本超出可视宽度隐藏并加上tooltip
 * @param content: 展示值及提示词
 * @param width: 展示值宽度
 * @param effect: 主题色
 * @author hejinsheng
 */
export default {
  name: 'BTooltip',
  props: {
    content: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '130px'
    },
    effect: {
      type: String,
      default: 'light'
    },
    placement: {
      type: String,
      default: 'top-start'
    }
  },
  data () {
    return {
      isShowTooltip: false
    }
  },
  methods: {
    visibilityChange (event) {
      const ev = event.target
      const ev_weight = ev.scrollWidth // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth// 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true
      } else {
        // 否则为不溢出
        this.isShowTooltip = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
