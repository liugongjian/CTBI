<template>
  <el-container v-if="JSON.stringify(option)!=='{}'">
    <el-tabs v-model="activeNames">
      <el-tab-pane
        label="字段"
        name="1"
      >
        <data-panel :identify="layoutId" />
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
</template>

<script>
import store from '@/store'
import Styles from '@/views/bi/Settings/Styles'
import DataPanel from './DataPanel.vue'
export default {
  name: 'Settings',
  components: {
    Styles,
    DataPanel
  },
  data () {
    return {
      option: {},
      layoutId: null,
      activeNames: '2'
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
    }
  }
}
</script>
