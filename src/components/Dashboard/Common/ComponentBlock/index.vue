<template>
  <div
    v-loading="loading"
    :class="[{'com-block-selected': option.i === $store.state.app.currentLayoutId && $store.state.app.dashboardMode === 'edit'},'com-block']"
    :style="styleObject"
  >

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
      <!-- 隐藏模块，用于解决标题不显示出现的布局问题 -->
      <div
        class="card-header-hidden"
        style="width:0"
      />
      <div class="card-header-tail">
        <!-- 指标筛选模块 -->
        <el-select
          v-if="getParameter(option, 'theme.FunctionalOption.ChartFilter.showFilter')"
          v-model="selectedIndicator"
          :disabled="!getParameter(option, 'theme.FunctionalOption.ChartFilter.showFilter')"
          :multiple="getParameter(option, 'theme.FunctionalOption.ChartFilter.isMultiple')"
          :class="{
            disabled : selectedIndicator.length<=1,
          }"
          @change="handleIndicator"
        >
          <el-option
            v-for="item in getParameter(option, 'theme.FunctionalOption.ChartFilter.indicatorOption')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="selectedIndicator.length<=1 && selectedIndicator[0]==item.value"
          />
        </el-select>

        <!-- 菜单模块 -->
        <div v-if="showCommandMenu">
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
              <el-dropdown-item command="copy">复制</el-dropdown-item>
              <el-dropdown-item command="sql">查看SQL</el-dropdown-item>
              <el-dropdown-item command="data">查看数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
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

    <!-- 是否展示总计 -->
    <div style="max-height:100px">
      <div
        v-if="getParameter(option, 'theme.ComponentOption.TotalShow.show')"
        class="rich-text-content"
      >
        <span style="margin-right: 20px">{{ getParameter(option, 'theme.ComponentOption.TotalShow.name') }}</span>
        <span>{{ getParameter(option, 'theme.ComponentOption.TotalShow.value') }}</span>
      </div>
    </div>

    <!-- 当备注位置选择为图表上方时 -->
    <div
      class="rich-text-editor"
      style="max-height:100px;min-height: 18px;"
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
        style="max-height:100px;min-height: 18px;"
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
import { getParameter, getCurrentLayout, createNanoId, deepClone, isEmpty } from '@/utils/optionUtils'
import store from '@/store'
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
      loading: false,
      onLoad: false,
      imgSizeOption: { // 图片尺寸及位置，格式："尺寸名":['图片尺寸','图片位置']
        'containLeft': ['contain', ' left center'],
        'containMiddle': ['contain', 'center center'],
        'containRight': ['contain', 'right center'],
        'coverClip': ['cover', 'center center'],
        'cover': ['100% 100%', '']
      }
    }
  },
  computed: {

    // 获取样式数据
    styleObject () {
      const styleObject = {}
      // 是否显示自定义填充
      if (getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.show')) {
        // 设置背景图片颜色
        styleObject['background-color'] = getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.color')
        if (getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.showImg')) {
          // 设置背景图片及尺寸位置
          styleObject['background'] = `url(${getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.imgUrl')}) no-repeat`
          styleObject['background-size'] = this.imgSizeOption[getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.imgSize')][0]
          styleObject['background-position'] = this.imgSizeOption[getParameter(this.option, 'theme.Basic.CustomBackgroundEnable.imgSize')][1]
        }
        return styleObject
      }
      return styleObject
    },
    selectedIndicator: {
      get () {
        return this.getParameter(this.option, 'theme.FunctionalOption.ChartFilter.selectedIndicator')
      },
      set () {
      }
    },
    showCommandMenu () {
      return store.state.app.dashboardMode === 'edit'
    }
  },
  mounted () {
    // 防止宽高计算未完成就开始渲染组件
    this.$nextTick(() => {
      this.onLoad = true

      this.$bus.$on('showLoading', (id) => {
        if (id === this.option.id) {
          this.loading = true
        }
      })
      this.$bus.$on('closeLoading', (id) => {
        if (id === this.option.id) {
          this.loading = false
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('showLoading', (id) => {
      this.loading = true
    })
    this.$bus.$off('closeLoading', () => {
      this.loading = false
    })
  },
  methods: {
    deleteBlock () {
      console.log('触发了删除事件')
      const id = store.state.app.currentLayoutId
      if (id) {
        // 删除vuex的layout中对应的组件信息
        this.$store.dispatch('app/deleteLayoutById', id)
      }
    },
    getParameter,
    // 下拉菜单方法
    handleCommand (command) {
      const method = this[command]
      if (method && typeof method === 'function') {
        method.call()
      }
    },

    delete () {
      // 删除vuex的layout中对应的组件信息
      // 当时tab组件时，删除所有属于该组件的组件
      if (this.option.is === 'TabChart') {
        const allLayout = [...store.state.app.layout].filter(item => !(item.tabIdChains || []).includes(this.option.i))
        store.dispatch('app/updateLayout', allLayout)
      }
      store.dispatch('app/deleteLayoutById', this.option.i)
    },

    // 复制组件
    copy () {
      const currentLayout = getCurrentLayout()
      const newLayout = deepClone(currentLayout)
      if (isEmpty(newLayout)) {
        console.error('获取当前组件失败, Line: ComponentBlock: 214')
        return
      }
      const nanoId = createNanoId()
      newLayout.i = nanoId
      newLayout.id = nanoId
      const layoutLength = store.state.app.layout.length
      newLayout.x = layoutLength > 0 ? (layoutLength * 2) % 12 : 0
      newLayout.y = layoutLength > 0 ? layoutLength + 12 : 0
      store.dispatch('app/addLayout', newLayout)
    },

    sql () {
      if (this.isExistDataSet()) {
        this.$dialog.show('ShowSqlDialog')
      } else {
        this.$message.warning('未选择数据集或字段')
      }
    },

    data () {
      if (this.isExistDataSet()) {
        this.$dialog.show('ShowDataDialog')
      } else {
        this.$message.warning('未选择数据集或字段')
      }
    },

    // 判断是否存在数据集和字段
    // 存在 true 不存在 false
    isExistDataSet () {
      const { option: { dataSource, dataSet } } = this.option
      const result = false
      if (!dataSet?.id) {
        return false
      }
      for (const key in dataSource) {
        const source = dataSource[key]
        if (source.value.length > 0) {
          return true
        }
      }
      return result
    },

    // 展示链接跳转弹窗
    showDialog () {
      const that = this
      this.$dialog.show('RCDialog', { url: getParameter(that.option, 'theme.Basic.TitleLink.url') }, this.callback)
    },

    // 筛选指标方法
    handleIndicator (val) {
      this.option.option.theme.FunctionalOption.ChartFilter.selectedIndicator = val
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  ::v-deep .disabled .el-tag__close{ display: none !important;}
</style>
