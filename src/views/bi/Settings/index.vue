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
          <span
            class="panel-icon"
            @click="toggleWrapperFold"
          >
            <svg-icon :icon-class="showWrapper?'panel-fold':'panel-unfold'" />
          </span>
        </div>
        <el-container v-show="showWrapper">
          <el-tabs v-model="activeNames">
            <el-tab-pane
              label="字段"
              name="1"
            >
              <data-panel-field :identify="layoutId" />
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
          <span
            class="panel-icon"
            @click="toggleDataFold"
          >
            <svg-icon :icon-class="showData?'panel-fold':'panel-unfold'" />
          </span>
        </div>
      </div>
    </div>

    <!-- 页面设置 -->
    <div
      v-else
      class="page-config-panel"
    >
      <div class="page-config-top">页面设置</div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Styles from '@/views/bi/Settings/Styles'
import DataPanelField from './DataPanelField.vue'
export default {
  name: 'Settings',
  components: {
    Styles,
    DataPanelField
  },
  data () {
    return {
      showWrapper: true,
      showData: true,
      option: {},
      layoutId: null,
      activeNames: '2'
    }
  },
  computed: {
    currentLayoutId () {
      return store.state.app.currentLayoutId
    }
  },
  mounted () {
    this.$bus.$on('reloadOption', this.reloadOption)
  },
  methods: {
    // 通过id获取vuex中的layout数据
    reloadOption (id) {
      const temp = store.state.app.layout.find(item => {
        return item.i === id
      })
      this.option = temp.option
      this.layoutId = id
    },
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
    }
  }
}
</script>
