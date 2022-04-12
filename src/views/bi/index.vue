<template>
  <el-container>
    <el-header class="bi-header">
      <!-- 设置栏 -->
      <Dashboard />
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
        <el-main
          class="main-layout"
        >
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
import Dashboard from './Dashboard'
// 导入样式
import '@/views/bi/index.scss'
export default {
  components: {
    Widget, Settings, Tools, Dashboard
  },
  mounted () {
    // 获取本地layout，进行画布初始化
    if (localStorage.getItem('layout')) {
      const layout = JSON.parse(localStorage.getItem('layout'))
      this.$store.state.app.layout = layout
    }
  },
  methods: {
    dragover (event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
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
