<template>
  <div :class="[{'com-block-selected': option.i === $store.state.app.currentLayoutId},'com-block']">

    <div class="card-header-wrapper">
      <div
        v-show="getParameter(option, 'theme.Basic.Title.show')"
        :style="{color: getParameter(option, 'theme.Basic.Title.color') || '#333' }"
      >{{ getParameter(option, 'theme.Basic.Title.text') }}
        <!-- 当备注位置选择为紧跟标题时 -->
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
      <div class="card-header-tail">
        <!-- 菜单模块 -->
        <el-dropdown
          trigger="click"
          size="small"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            <svg-icon
              icon-class="menu"
              style="font-size: 15px;"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 菜单模块END -->

        <!-- 链接跳转模块 -->
        <div
          v-show="getParameter(option, 'theme.Basic.TitleLink.show') && getParameter(option, 'theme.Basic.TitleLink.url')"
          class="card-header-link-wrapper"
        >
          <!-- 当打开方式为新窗口时 -->
          <a
            v-show="getParameter(option, 'theme.Basic.TitleLink.openType')==='blank'"
            :href="getParameter(option, 'theme.Basic.TitleLink.url')"
            target="blank"
            class="card-header-link"
          >
            {{ getParameter(option, 'theme.Basic.TitleLink.text')||`链接跳转` }}</a>
          <!-- 当打开方式为弹窗时 -->
          <a
            v-show="getParameter(option, 'theme.Basic.TitleLink.openType')==='dialog'"
            class="card-header-link"
            @click="showDialog"
          >
            {{ getParameter(option, 'theme.Basic.TitleLink.text')||`链接跳转` }}</a>
          <i class="el-icon-arrow-right" />
        </div>
        <!-- 链接跳转模块END -->
      </div>
    </div>

    <!-- 当备注位置选择为图表上方时 -->
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
    // 下拉菜单方法
    handleCommand (command) {
      if (command === 'delete') {
        // 删除vuex的layout中对应的组件信息
        this.$store.dispatch('app/deleteLayoutById', this.option.i)
      }
    },

    // 展示链接跳转弹窗
    showDialog () {
      const that = this
      this.$dialog.show('RCDialog', { url: getParameter(that.option, 'theme.Basic.TitleLink.url') }, this.callback)
    }

  }
}
</script>

<style lang="scss" scoped>
.com-block {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 18px;
  border: 1px solid black;
  flex-direction: column;
  box-sizing: border-box;
  touch-action: none;
  .card-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    vertical-align: top;
    .card-header-tail {
      display: flex;
      align-items: center;
      height: 14px;
      min-width: fit-content;
      padding-left: 6px;
      .card-header-link-wrapper {
        max-width: 90px;
        overflow: hidden;
        display: flex;
        align-items: center;
        margin-left: 4px;
        .card-header-link {
          color: rgba(0, 0, 0, 0.8);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }
    }
  }
  &.com-block-selected {
    border: 1px solid #468cff;
    box-shadow: 0 0 1px 1px #468cff !important;
  }
  &:hover .el-dropdown .el-dropdown-link {
    display: block;
  }
  .el-dropdown {
    .el-dropdown-link {
      display: none;
      cursor: pointer;
    }
  }
}
.rich-text-footer {
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
