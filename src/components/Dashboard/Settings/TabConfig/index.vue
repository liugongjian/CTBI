<template>
  <div
    class="editor-object-container"
  >
    <div>
      <el-button type="primary" icon="el-icon-plus" style="width:100%;" @click="addTab">新增Tab标签</el-button>
    </div>
    <div v-for="item in tabs" :key="item.name" class="inputWrap">
      <el-input v-model="item.title" placeholder="请输入Tab名称,不超过30个字符" maxlength="30" style="width:100%" @blur="() => testTitle(item)" />
    </div>
  </div>
</template>
<script>
import store from '@/store'
export default {
  name: 'TabConfig',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    layout () {
      // 去除属于tab组件的layout
      return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)
    },
    tabs() {
      return this.layout.tabPanels
    }
  },
  methods: {
    addTab() {
      if (this.layout.tabPanels && this.layout.tabPanels.length > 9) {
        this.$message.warning('最多只能添加10个Tab')
        return
      }
      const newTabName = Date.now() + ''
      const paneId = `${this.layout.i}-${newTabName}`
      this.layout.tabPanels.push({
        title: 'New Tab',
        name: newTabName,
        paneId
      })
      this.layout.activeTabId = paneId
      console.log(this.layout)
    },
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
    testTitle (tab) {
      console.log(tab)
      if (!tab.title) {
        tab.title = 'New Tab'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.inputWrap{
  margin-top: 10px;
  display: flex;
  align-items: center;
  .delete{
    color: rgba($color: #ffffff, $alpha: 0.65);
    font-size: 14px;
    cursor: pointer;
    &:hover{
      color: rgba($color: #ffffff, $alpha: 0.85);
    }
  }
}
</style>
