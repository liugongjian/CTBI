/* eslint-disable vue/no-template-shadow */
/**
 * tab添加逻辑组件
 * 用户添加Tab组件时，向store.layout 中添加一个新is是TabChart的layout对象，同时该对象中含有类型为数组的tabPanels的属性，
 * 其中含有{name, paneId: tabId + name}的tabPane;
 * 用户可以向tabPanels中添加或者减少tabPane, tabPane的内容是一个GridLayout； 当用户向tab中添加Chart时，就是
 * 向store.layout 中添加一个新is是该Chart的layout对象，同时该对象多一个containerId的属性,值是tabId
 * 渲染TabPane时，就是渲染GridLayout，GridLayout的layout的值就是store中所有containerId是该TabPane的tabId的layout的集合
 */
<template>
  <div :id="layout.i" style="width:100%;height:100%;" class="tab-chart-wrap">
    <el-tabs v-model="editableTabsValue" type="card" editable @tab-remove="removeTab" @tab-add="addTab" @tab-click="changeTab">
      <el-tab-pane
        v-for="itm in layout.tabPanels"
        :key="itm.name"
        :label="itm.title"
        :name="itm.name"
      >
        <div :style="{height: tabHeight + 'px'}" class="gridWrap"><tab-panel :id="itm.paneId" /></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import barMixins from '@/components/Dashboard/mixins/barMixins'
// import { GridLayout, GridItem } from 'vue-grid-layout'
import TabPanel from './TabPanel'
import { getLayoutById } from '@/utils/optionUtils'
import store from '@/store'
export default {
  name: 'TabChart',
  components: {
    TabPanel
  },
  // mixins: [barMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'TabChart',
      editableTabsValue: '1',
      tabIndex: 2,
      layout1: [
        { 'x': 0, 'y': 0, 'w': 2, 'h': 1, 'i': '0', static: false },
        { 'x': 2, 'y': 1, 'w': 2, 'h': 1, 'i': '1', static: false },
        { 'x': 4, 'y': 2, 'w': 2, 'h': 1, 'i': '2', static: false }
      ],
      draggable: true,
      resizable: true,
      index: 0
    }
  },
  computed: {
    layout () {
      // 去除属于tab组件的layout
      return getLayoutById(this.identify)
    },
    tabHeight() {
      return this.layout.h * 100 - 80
    }
  },
  mounted () {
    this.editableTabsValue = this.layout.tabPanels[0].name
  },
  methods: {
    removeTab(targetName) {
      const tabs = this.layout.tabPanels
      let activeName = this.editableTabsValue
      let activeTabId = this.layout.activeTabId
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              activeTabId = nextTab.paneId
            }
          }
        })
      }

      this.editableTabsValue = activeName
      const newTabs = tabs.filter(tab => tab.name !== targetName)
      if (newTabs.length === 0) {
        store.dispatch('app/deleteLayoutById', this.layout.i)
      } else {
        this.layout.tabPanels = newTabs
        this.layout.activeTabId = activeTabId
      }
      const removeTab = tabs.find(tab => tab.name === targetName)
      const allLayout = [...store.state.app.layout].filter(item => !(item.tabIdChains || []).includes(removeTab.paneId))
      store.dispatch('app/updateLayout', allLayout)
    },
    addTab() {
      const newTabName = Date.now() + ''
      const paneId = `${this.layout.i}-${newTabName}`
      this.layout.tabPanels.push({
        title: 'New Tab',
        name: newTabName,
        paneId
      })
      this.layout.activeTabId = paneId
      console.log(this.layout)
      this.editableTabsValue = newTabName
    },
    changeTab (e) {
      console.log(e.name)
      const chooseTab = this.layout.tabPanels.find(item => item.name === e.name)
      this.layout.activeTabId = chooseTab.paneId
    },
    dragover (event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    // 清空CurrentLayoutId来显示页面配置
    clearCurrentLayoutId () {
      this.$store.state.app.currentLayoutId = ''
    },
    itemTitle(item) {
      let result = item.i
      if (item.static) {
        result += ' - Static'
      }
      return result
    }
  }
}
</script>

<style>
.gridWrap{
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
