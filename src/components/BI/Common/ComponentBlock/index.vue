<template>
  <div
    :class="[{'com-block-selected': option.i === $store.state.app.currentLayoutId},'com-block']"
    @click.stop="clickHandler"
  >
    <div
      v-show="getParameter(option, 'theme.Basic.Title.show')"
      :style="{color: getParameter(option, 'theme.Basic.Title.color') || '#333' }"
    >{{ getParameter(option, 'theme.Basic.Title.text') }}
      <!-- 当位置选择为紧跟标题时 -->
      <el-tooltip
        v-show="getParameter(option, 'theme.Basic.Mark.show') && getParameter(option, 'theme.Basic.Mark.position') === 'afterTitle'"
        placement="bottom"
        effect="light"
      >
        <div
          slot="content"
          v-html="getParameter(option, 'theme.Basic.Mark.text')"
        />
        <i class="el-icon-warning-outline m-l-10" />
      </el-tooltip>
    </div>
    <!-- 当位置选择为图表上方时 -->
    <div
      class="rich-text-editor"
      style="max-height:100px"
    >
      <div
        v-show="getParameter(option, 'theme.Basic.Mark.show') && getParameter(option, 'theme.Basic.Mark.position') === 'onChart'"
        class="rich-text-content"
        v-html="getParameter(option, 'theme.Basic.Mark.text')"
      />
    </div>
    <slot v-if="onLoad" />
    <!-- 尾注内容 -->
    <div class="rich-text-footer">
      <div
        class="rich-text-editor"
        style="max-height:100px"
      >

        <div
          v-show="getParameter(option, 'theme.Basic.Footer.show')"
          class="rich-text-content"
          v-html="getParameter(option, 'theme.Basic.Footer.text')"
        />
      </div>
    </div>
    <!-- 图表类型 -->
    <div class="rich-text-footer">
      <div
        class="rich-text-editor"
        style="max-height:100px"
      >

        <div
          v-show="getParameter(option, 'theme.Basic.ChartType.show')"
          class="rich-text-content"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { getParameter } from '@/utils/optionUtils'
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
    getParameter,
    clickHandler () {
      // 更新当前id
      this.$store.dispatch('app/updateLayoutId', this.option.i)
      // 通知右侧重新渲染
      this.$bus.$emit('reloadOption', this.option.i)
    }
  }
}
</script>

<style lang="scss" scoped>
.com-block {
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px solid black;
  flex-direction: column;
  box-sizing: border-box;
  touch-action: none;

  &.com-block-selected {
    border: 1px solid #468cff;
    box-shadow: 0 0 1px 1px #468cff !important;
  }
}
.rich-text-footer{
  flex-shrink: 0;
}
.rich-text-editor {
  overflow: auto;
  &.rich-text-content {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word;
  }
}
</style>
