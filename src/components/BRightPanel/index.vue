<template>
  <div>
    <!-- 组件设置 -->
    <div class="setting-panel">
      <!-- 配置项设置模块 -->
      <div :class="showWrapper?'setting-panel-wrapper-fold':'setting-panel-wrapper-unfold'">
        <!-- 顶部菜单模块 -->
        <div class="change-chart-type-menu">
          <!-- 图例切换 -->
          <ChartSwitchHeader
            v-if="showWrapper && isCommonChart && showSwitchHeader"
            class="change-type"
            :chart-name="chartName"
            :icon-name="currentChart"
            :show-chart-types="showChartTypes"
            @click.native="changeChart"
          />
          <!-- 非图表组件仅显示名称 -->
          <span v-if="!isCommonChart">{{ chartName }}</span>
          <span
            class="panel-icon"
            @click="toggleWrapperFold"
          >
            <svg-icon :icon-class="showWrapper?'panel-unfold':'panel-fold'" />
          </span>
        </div>
        <!-- 图例切换模块 -->
        <el-container
          v-if="showChartTypes&&showWrapper"
          class="chart-type-switch"
        >
          <ChartSwitcher :type="optionType" />
        </el-container>
        <el-container v-if="showWrapper && !showChartTypes">
          <el-tabs v-model="activeNames">
            <el-tab-pane
              v-if="isCommonChart"
              label="字段"
              name="1"
            >
              <slot name="field-panel" />
            </el-tab-pane>
            <el-tab-pane
              label="样式"
              name="2"
            >
              <slot name="style-panel" />
            </el-tab-pane>
            <el-tab-pane
              label="高级"
              name="3"
            >
              <slot name="advanced-panel" />
            </el-tab-pane>
          </el-tabs>
        </el-container>
        <div
          v-show="showWrapper === false"
          style="height:calc(100vh - 190px)"
        >
          <!-- showItem展开面板，1:字段；2：样式；3：高级 -->
          <div
            class="config-item"
            @click="showItem('1')"
          ><span>字段</span></div>
          <div
            class="config-item"
            @click="showItem('2')"
          ><span>样式</span></div>
          <div
            class="config-item"
            @click="showItem('3')"
          ><span>高级</span></div>
        </div>
      </div>

      <!-- 数据集模块 -->
      <div
        v-if="isCommonChart"
        class="data-panel"
        :class="showData?'data-panel-fold':'data-panel-unfold'"
      >
        <!-- 顶部菜单模块 -->
        <div class="change-chart-type-menu">
          <span v-show="showData">数据</span>
          <span
            class="panel-icon"
            @click="toggleDataFold"
          >
            <svg-icon :icon-class="showData?'panel-unfold':'panel-fold'" />
          </span>
        </div>
        <div
          v-show="showData===false"
          style="height:calc(100vh - 98px)"
        >
          <!-- showItem展开面板，1:字段；2：样式；3：高级 -->
          <div
            class="config-item"
            @click="showData=true"
          ><span>数据</span></div>
        </div>
        <data-panel
          v-show="showData"
          style="height:calc(100vh - 98px)"
          :option="dataSourceOptions"
          :data-set="dataSetOptions"
          @changeActiveName="showItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import DataPanel from './DataPanel.vue'
import ChartSwitchHeader from '@/views/dashboard/Settings/ChartSwitchHeader.vue'
import ChartSwitcher from '@/views/dashboard/Settings/ChartSwitcher.vue'

export default {
  name: 'BRightPanel',
  components: {
    DataPanel,
    ChartSwitchHeader,
    ChartSwitcher
  },
  props: {
    // 是否展示图例切换组件
    showSwitchHeader: {
      type: Boolean,
      default: false
    },
    // 当前仪表盘组件ID
    currentLayoutId: {
      type: String,
      default: ''
    },
    // 当前选中组件类型
    optionType: { type: String, default: '' },
    // 数据源配置项
    dataSourceOptions: {
      type: Object,
      default: () => {}
    },
    // 数据集配置项
    dataSetOptions: {
      type: Object,
      default: () => {}
    },
    // 当前选中组件名称
    chartName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showWrapper: true,
      showData: true,
      activeNames: '2',
      showChartTypes: false
    }
  },
  computed: {
    currentChart () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return temp ? temp.is : ''
    },
    isCommonChart () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return temp ? !['TabChart'].includes(temp.is) : true
    }
  },

  methods: {
    // 展开面板并显示对应模块
    showItem (name) {
      this.showWrapper = true
      this.activeNames = name
    },
    // 折叠面板
    toggleWrapperFold () {
      this.showWrapper = !this.showWrapper
    },
    toggleDataFold () {
      this.showData = !this.showData
    },
    changeChart () {
      this.showChartTypes = !this.showChartTypes
    }
  }
}
</script>
<style lang="scss" scoped>
.change-type {
  cursor: pointer;
}
.chart-type-switch {
  overflow: auto;
}
</style>
