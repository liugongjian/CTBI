<template>
  <el-container>
    <el-header class="bi-header">
      <!-- 设置栏 -->
      <Navbar :dashboard="dashboard" :mode="mode" />
    </el-header>
    <el-container>
      <el-container>
        <!-- 工具栏 -->
        <el-header class="tool-header">
          <Tools
            @getGridLayout="getGridLayout"
            @getParentRect="getParentRect"
          />
        </el-header>
        <!-- 画布主体 -->
        <el-main class="main-layout" :style="layoutStyles">
          <div
            id="content"
            @dragover="dragover"
            @click="clearCurrentLayoutId"
          >
            <widget ref="gridLayout" />
          </div>
        </el-main>
      </el-container>
      <!-- 配置项 -->
      <div>
        <Settings />
      </div>
    </el-container>
  </el-container>
</template>

<script>
import Settings from './Settings/index.vue'
import Widget from './Widget/index.vue'
import Tools from './Tools'
import Navbar from './Navbar'
// 导入样式
import '@/views/dashboard/index.scss'
import { getDashboardDetail } from '@/api/dashboard'
export default {
  components: {
    Widget, Settings, Tools, Navbar
  },
  data() {
    return {
      dashboard: {
        name: ''
      },
      mode: this.$route.query.mode || 'edit'
    }
  },
  computed: {
    layoutStyles() {
      return this.$store.state.settings.layoutStyles
    }
  },
  mounted () {
    // 获取本地数据，进行画布初始化
    if (localStorage.getItem('layout')) {
      const layout = JSON.parse(localStorage.getItem('layout'))
      this.$store.state.app.layout = layout
    }
    if (localStorage.getItem('dataOption')) {
      const dataOption = JSON.parse(localStorage.getItem('dataOption'))
      this.$store.state.app.dataOption = dataOption
    }
    if (localStorage.getItem('layoutStyles')) {
      const layoutStyles = JSON.parse(localStorage.getItem('layoutStyles'))
      this.$store.state.settings.layoutStyles = layoutStyles
    }
    this.getDashboardData()
  },
  methods: {
    async getDashboardData() {
      const { id } = this.$route.query
      if (id) {
        const result = await getDashboardDetail(id)
        console.log(result)
        this.dashboard = result
      }
    },
    dragover (event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    getGridLayout (callback) {
      callback(this.$refs.gridLayout.$children[0])
    },
    // 清空CurrentLayoutId来显示页面配置
    clearCurrentLayoutId () {
      this.$store.state.app.currentLayoutId = ''
    },
    // 获取画布边界
    getParentRect (callback) {
      const domRec = document.querySelector('#content').getBoundingClientRect()
      callback({
        bottom: domRec.bottom,
        height: domRec.height,
        left: domRec.left,
        right: domRec.right,
        top: domRec.top,
        width: domRec.width,
        x: domRec.x,
        y: domRec.y
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-header{
    position: relative;
}
</style>
