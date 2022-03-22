<template>
  <el-container>
    <el-tabs
      v-if="option"
      v-model="activeNames"
    >
      <el-tab-pane
        label="字段"
        name="1"
      />
      <el-tab-pane
        label="样式"
        name="2"
      >
        <Styles :option="option" />
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
export default {
  name: 'Settings',
  components: {
    Styles
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
