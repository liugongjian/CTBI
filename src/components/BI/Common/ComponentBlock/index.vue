<template>
  <div
    style="width:100%;height:100%;display: flex;flex-direction: column;"
    @click="clickHandler"
  >
    <div
      v-show="$optionUtils.getParameter(option, 'Basic.Title.isShow')"
      :style="{color: $optionUtils.getParameter(option, 'Basic.Title.color') || '#333' }"
    >{{ $optionUtils.getParameter(option, 'Basic.Title.text') }}
      <!-- 当位置选择为紧跟标题时 -->
      <el-tooltip
        v-show="$optionUtils.getParameter(option, 'Basic.Remark.isShow') && $optionUtils.getParameter(option, 'Basic.Remark.position') === 'afterTitle'"
        placement="bottom"
        effect="light"
      >
        <div
          slot="content"
          v-html="$optionUtils.getParameter(option, 'Basic.Remark.text')"
        />
        <i class="el-icon-warning-outline m-l-10" />
      </el-tooltip>
    </div>
    <!-- 当位置选择为图表上方时 -->
    <div
      v-show="$optionUtils.getParameter(option, 'Basic.Remark.isShow') && $optionUtils.getParameter(option, 'Basic.Remark.position') === 'onChart'"
      v-html="$optionUtils.getParameter(option, 'Basic.Remark.text')"
    />
    <slot v-if="onLoad" />
    <!-- 尾注内容 -->
    <div
      v-show="$optionUtils.getParameter(option, 'Basic.Endnodes.isShow')"
      v-html="$optionUtils.getParameter(option, 'Basic.Endnodes.text')"
    />
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
      // 更新当前id
      this.$store.dispatch('app/updateLayoutId', this.option.i)
      // 通知右侧重新渲染
      this.$bus.$emit('reloadOption', this.option.i)
    }
  }
}
</script>

<style>
</style>
