<template>
  <div>
    <!-- 组件设置 -->
    <div
      v-if="currentLayoutId"
      class="setting-panel"
    >
      <!-- 配置项设置模块 -->
      <div :class="showWrapper?'setting-panel-wrapper-fold':'setting-panel-wrapper-unfold'">
        <!-- 顶部菜单模块 -->
        <div class="change-chart-type-menu">
          <!-- 图例切换 -->
          <ChartSwitchHeader
            v-if="showWrapper"
            class="change-type"
            :chart-name="option.theme.Basic.Title.text"
            :icon-name="currentChart"
            :show-chart-types="showChartTypes"
            @click.native="changeChart"
          />
          <span
            class="panel-icon"
            @click="toggleWrapperFold"
          >
            <svg-icon :icon-class="showWrapper?'panel-unfold':'panel-fold'" />
          </span>
        </div>
        <el-container v-if="showWrapper && !showChartTypes">
          <el-tabs v-model="activeNames">
            <el-tab-pane
              label="字段"
              name="1"
            >
              <data-panel-field
                :identify="currentLayoutId"
                :option="option"
              />
            </el-tab-pane>
            <el-tab-pane
              label="样式"
              name="2"
            >
              <Styles :option="option.theme" />
            </el-tab-pane>
            <el-tab-pane
              label="高级"
              name="3"
            />
          </el-tabs>
        </el-container>
        <!-- 图例切换模块 -->
        <el-container
          v-show="showChartTypes&&showWrapper"
          class="chart-type-switch"
        >
          <ChartSwitcher :option="option" />
        </el-container>
        <div
          v-show="showWrapper===false"
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
          :option="option.dataSource"
          :data-set="option.dataSet"
        />
      </div>
    </div>

    <!-- 页面设置 -->
    <div
      v-else
      class="page-config-panel"
    >
      <div class="page-config-top">页面设置</div>
      <page-style />
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Styles from '@/views/dashboard/Settings/Styles'
import DataPanelField from './DataPanelField.vue'
import DataPanel from './DataPanel.vue'
import ChartSwitchHeader from '@/views/dashboard/Settings/ChartSwitchHeader.vue'
import ChartSwitcher from '@/views/dashboard/Settings/ChartSwitcher.vue'
import PageStyle from './components/PageStyle.vue'

export default {
  name: 'Settings',
  components: {
    Styles,
    DataPanelField,
    DataPanel,
    ChartSwitchHeader,
    ChartSwitcher,
    PageStyle
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
    currentLayoutId () {
      return store.state.app.currentLayoutId
    },
    option () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return temp.option
    },
    currentChart () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return temp.is
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
