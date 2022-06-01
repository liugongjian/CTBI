<template>
  <el-container>
    <el-header class="bi-header">
      <!-- 设置栏 -->
      <Navbar :dashboard="dashboard" :mode="mode" @handleChange="handleNavbarChange" />
    </el-header>
    <el-container>
      <el-container>
        <!-- 工具栏 -->
        <el-header v-if="mode === 'edit'" class="tool-header">
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
      <div v-if="mode === 'edit'">
        <Settings />
      </div>
    </el-container>
    <el-dialog
      title="恢复提示"
      :visible.sync="recoverVisible"
      width="480px"
    >
      <div class="data-set-didlog-del">
        <svg-icon
          icon-class="warning"
          style="margin-right: 16px"
        />
        <span>该仪表板内容上次未正常保存，是否恢复上次内容？</span>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelRecover">不</el-button>
        <el-button
          type="primary"
          @click="confirmRecover"
        >恢复</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import Settings from './Settings/index.vue'
import Widget from './Widget/index.vue'
import Tools from './Tools'
import Navbar from './Navbar'
import store from '@/store'
import _ from 'lodash'
// 导入样式
import '@/views/dashboard/index.scss'
import { getDashboardDetail } from '@/api/dashboard'
export default {
  components: {
    Widget, Settings, Tools, Navbar
  },
  data() {
    const dashboardId = this.$route.query.id || ''
    this.timer = null
    this.saveName = 'dashboard-' + (dashboardId || 'new')
    this.saveTagName = this.saveName + '-tag'
    return {
      dashboard: {
        name: ''
      },
      mode: this.$route.query.mode || 'edit',
      dashboardId,
      recoverVisible: false
    }
  },
  computed: {
    layout () {
      return store.state.app.layout
    },
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
    this.saveDashboardToLocal()
    this.recoverDashboard()
    window.addEventListener('beforeunload', this.beforeunload)
  },
  destroyed() {
    if (this.timer) {
      console.log('destroyed')
      clearTimeout(this.timer)
    }
    console.log('destroyed')
    localStorage.removeItem(this.saveName)
    localStorage.removeItem(this.saveTagName)
    window.removeEventListener('beforeunload', this.beforeunload)
  },
  methods: {
    recoverDashboard() {
      const saveName = this.saveName
      const saveData = localStorage.getItem(saveName)
      const saveTag = localStorage.getItem(this.saveTagName)
      if (saveData && saveTag !== 'saved') {
        this.recoverVisible = true
      }
    },
    confirmRecover() {
      const saveName = this.saveName
      const saveData = localStorage.getItem(saveName)
      console.log(saveData)
      store.dispatch('app/updateLayout', JSON.parse(saveData))
      this.cancelRecover()
    },
    cancelRecover() {
      this.recoverVisible = false
      localStorage.removeItem(this.saveName)
      localStorage.removeItem(this.saveTagName)
    },
    async getDashboardData() {
      const id = this.dashboardId
      if (id) {
        const result = await getDashboardDetail(id)
        console.log(result)
        this.dashboard = result
        if (!this.recoverVisible) {
          const settings = result.setting ? JSON.parse(result.setting) : null
          if (settings && Array.isArray(settings)) {
            store.dispatch('app/updateLayout', settings)
          }
        }
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
    },
    handleNavbarChange({ action, data }) {
      if (action === 'changeMode') {
        this.mode = data
        console.log(JSON.stringify(this.layout))
      }
      if (action === 'saveSuccess') {
        if (!this.dashboardId) {
          localStorage.removeItem(this.saveName)
          localStorage.removeItem(this.saveTagName)
          this.saveName = 'dashboard-' + data._id
          this.saveTagName = this.saveName + '-tag'
          this.dashboardId = data._id
        }
        localStorage.setItem(this.saveName, JSON.stringify(this.layout))
        localStorage.setItem(this.saveTagName, 'saved')
        this.dashboard = data
      }
    },
    saveDashboardToLocal() {
      console.log('saveDashboardToLocal')
      const saveName = this.saveName
      const saveTagName = this.saveTagName
      this.timer = setTimeout(() => {
        if (!this.recoverVisible) {
          const nextData = JSON.stringify(this.layout)
          const saveData = localStorage.getItem(saveName)
          // const saveTag = localStorage.getItem(saveTagName)
          if (saveData) {
            if (!_.isEqual(JSON.parse(nextData), JSON.parse(saveData))) {
              localStorage.setItem(saveName, nextData)
              localStorage.setItem(saveTagName, 'unsaved')
              console.log('saveDashboardToLocal12345')
            }
          } else {
            localStorage.setItem(saveName, nextData)
            console.log('saveDashboardToLocal123456')
          }
        }
        this.saveDashboardToLocal()
      }, 10 * 1000)
    },
    beforeunload(e) {
      console.log(e)
      e.returnValue = '你还没有保存'
      e.preventDefault()
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-header{
    position: relative;
}
</style>
