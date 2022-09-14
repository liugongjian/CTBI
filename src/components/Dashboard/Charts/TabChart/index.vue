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
  <div
    :id="layout.i"
    style="width:100%;height:100%;"
    class="tab-chart-wrap"
  >
    <div class="tab-header">
      <div
        v-for="item in layout.tabPanels"
        :key="item.name"
        class="tab-header-btn"
        :class="{'tab-header-active': item.name === editableTabsValue}"
        @click="() => changeTab(item)"
      >
        <el-tooltip effect="dark" :content="item.title" placement="top">
          <p class="tab-header-title">{{ item.title }}</p>
        </el-tooltip>
        <div
          v-if="isEdit"
          class="close"
          @click.stop="() => removeTab(item.name)"
        ><i class="el-icon-close" /></div>
      </div>
      <div
        v-if="!isEdit"
        class="tab-header-border"
      />
      <div
        v-if="isEdit"
        class="tab-header-add"
        @click="addTab"
      ><i class="el-icon-plus" /></div>
    </div>
    <div class="tab-content">
      <div
        v-for="item in layout.tabPanels"
        :key="item.name"
      >
        <div
          v-show="item.name === editableTabsValue"
          :style="{height: tabHeight + 'px'}"
          class="gridWrap"
        >
          <tab-panel :id="item.paneId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import barMixins from '@/components/Dashboard/mixins/barMixins'
// import { GridLayout, GridItem } from 'vue-grid-layout'
import TabPanel from './TabPanel'
import { getLayoutById, getParameter } from '@/utils/optionUtils'
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
      userChooseTab: null
    }
  },
  computed: {
    layout () {
      // 去除属于tab组件的layout
      return getLayoutById(this.identify)
    },
    tabHeight () {
      const titleHight = getParameter(this.layout, 'theme.Basic.Title.show') ? (getParameter(this.layout, 'theme.Basic.Title.size') || 14) : 14
      return (this.layout.height || 300) - (80 + titleHight)
    },
    editableTabsValue () {
      if (this.userChooseTab) {
        return this.userChooseTab
      }
      if (this.layout.tabPanels && this.layout.tabPanels.length > 0) {
        return this.layout.tabPanels[0].name
      }
      return '1'
    },
    activeTab () {
      return this.layout.tabPanels.find(tab => tab.name === this.editableTabsValue)
    },
    isEdit () {
      return store.state.app.dashboardMode === 'edit'
    }
  },
  methods: {
    removeTab (targetName) {
      const tabs = [...this.layout.tabPanels]
      let activeName = this.editableTabsValue
      let activeTabId = this.layout.activeTabId
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              console.log(nextTab)
              activeName = nextTab.name
              activeTabId = nextTab.paneId
            }
          }
        })
      }

      this.userChooseTab = activeName
      const index = tabs.findIndex(tab => tab.name === targetName)
      const newTabs = tabs.filter(tab => tab.name !== targetName)
      if (newTabs.length === 0) {
        store.dispatch('app/deleteLayoutById', this.layout.i)
      } else {
        // this.layout.tabPanels = newTabs
        this.layout.tabPanels.splice(index, 1)
        this.layout.activeTabId = activeTabId
      }
      const removeTab = tabs.find(tab => tab.name === targetName)
      const allLayout = [...store.state.app.layout].filter(item => !(item.tabIdChains || []).includes(removeTab.paneId))
      store.dispatch('app/updateLayout', allLayout)
    },
    addTab () {
      const newTabName = Date.now() + ''
      if (this.layout.tabPanels && this.layout.tabPanels.length > 9) {
        this.$message.warning('最多只能添加10个Tab')
        return
      }
      const paneId = `${this.layout.i}-${newTabName}`
      this.layout.tabPanels.push({
        title: 'New Tab',
        name: newTabName,
        paneId
      })
      this.layout.activeTabId = paneId
      this.userChooseTab = newTabName
    },
    changeTab (e) {
      this.userChooseTab = e.name
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
    itemTitle (item) {
      let result = item.i
      if (item.static) {
        result += ' - Static'
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-chart-wrap {
  background: #fff;
}
.tab-header {
  background: #fff;
  display: flex;
  margin-top: 5px;
  overflow: auto;
  .tab-header-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background: #f4f5f6;
    border: 1px solid rgba(221, 221, 221, 1);
    border-right: 0px;
    box-sizing: border-box;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    padding: 0px 20px;
    cursor: pointer;
    .close {
      width: 0px;
      height: 14px;
      border-radius: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 4px;
      overflow: hidden;
    }
    .tab-header-title{
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .tab-header-btn:hover {
    color: #fa8334;
    background: rgba(255, 255, 255, 0.6);
    .close {
      width: 14px;
      &:hover {
        background: rgba(0, 0, 0, 0.25);
        color: #fff;
      }
    }
  }
  .tab-header-active {
    color: #fa8334;
    background: #ffffff;
  }
  .tab-header-border {
    width: 1px;
    height: 40px;
    background: rgba(221, 221, 221, 1);
  }
  .tab-header-add {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background: #f4f5f6;
    border: 1px solid rgba(221, 221, 221, 1);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 700;
    padding: 0px 20px;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      color: #fa8334;
      background: rgba(255, 255, 255, 0.8);
    }
  }
}
.tab-content {
  background: #eff2f5;
}
.gridWrap {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
