<template>
  <div
    class="editor-object-container"
  >
    <div>
      <el-button type="primary" icon="el-icon-plus" style="width:100%;" @click="addTab">新增Tab标签</el-button>
    </div>
    <div v-for="item in tabs" :key="item.name" class="inputWrap">
      <el-input v-model="item.title" placeholder="请输入Tab名称" style="width:150px;" />
      <div class="delete" @click="removeTab"><i class="el-icon-delete" /></div>
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
  data () {
    return {
      tabs: []
    }
  },
  computed: {
    layout () {
      // 去除属于tab组件的layout
      return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)
    }
  },
  mounted () {
    this.getTabs()
  },
  methods: {
    getTabs () {
      this.tabs = this.layout.tabPanels
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
