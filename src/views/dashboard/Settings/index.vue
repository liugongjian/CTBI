<template>
  <div>
    <BRightPanel
      v-if="currentLayoutId"
      :show-switch-header="true"
      :chart-name="option.theme.Basic.Title.text"
      :data-source-options="option.dataSource"
      :data-set-options="option.dataSet"
      :current-layout-id="currentLayoutId"
    >

      <template #field-panel>
        <data-panel-field
          :identify="currentLayoutId"
          :option="option"
        />
      </template>
      <template #style-panel>
        <Styles :option="option.theme" />
      </template>

    </BRightPanel>
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
import PageStyle from './components/PageStyle.vue'

export default {
  name: 'Settings',
  components: {
    Styles,
    DataPanelField,
    PageStyle
  },
  data () {
    return {
      showWrapper: true,
      showData: true,
      activeNames: '1',
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
      return temp ? temp.option : {}
    },
    currentChart () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return temp.is
    },
    isCommonChart () {
      const temp = store.state.app.layout.find(item => {
        return item.id === this.currentLayoutId
      })
      return !['TabChart'].includes(temp.is)
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
