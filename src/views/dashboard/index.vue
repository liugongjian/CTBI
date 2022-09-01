<template>
  <el-container v-loading="loading && !recoverVisible">
    <el-header class="bi-header">
      <!-- 设置栏 -->
      <Navbar
        :dashboard="dashboard"
        :mode="mode"
        @handleChange="handleNavbarChange"
      />
    </el-header>
    <el-container>
      <el-container>
        <!-- 工具栏 -->
        <el-header
          v-show="mode === 'edit'"
          class="tool-header"
        >
          <Tools
            @getGridLayout="getGridLayout"
            @getParentRect="getParentRect"
          />
        </el-header>
        <!-- 画布主体 -->
        <el-main
          ref="mainLayout"
          :class="{'main-layout-edit': mode === 'edit', 'main-layout-preview': mode !== 'edit',}"
          :style="layoutStyles"
        >
          <div
            id="content"
            :style="scaleStyles"
            @dragover="dragover"
            @click="clearCurrentLayoutId"
          >
            <widget ref="gridLayout" :class="{ gridLayoutExtra: mode === 'edit'}" />
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
    <el-dialog
      title="未保存"
      :visible.sync="unsavedVisible"
      width="480px"
    >
      <div class="data-set-didlog-del">
        <svg-icon
          icon-class="warning"
          style="margin-right: 16px"
        />
        <span>该仪表板内容还未保存，确定离开？</span>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="unsavedVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmBack"
        >确定</el-button>
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
import { getTemplateDetail } from '@/api/template'
export default {
  name: 'DashBoard',
  components: {
    Widget, Settings, Tools, Navbar
  },
  data () {
    const dashboardId = this.$route.query.id || ''
    this.timer = null
    this.saveName = 'dashboard-' + (dashboardId || 'new')
    this.saveTagName = this.saveName + '-tag'
    return {
      dashboard: {
        name: ''
      },
      mode: this.$route.query.mode === '1' ? 'preview' : 'edit',
      dashboardId,
      recoverVisible: false,
      loading: false,
      useRecover: false,
      unsavedVisible: false
    }
  },
  computed: {
    layout () {
      return store.state.app.layout
    },
    layoutStyles () {
      return this.$store.state.settings.layoutStyles
    },
    scaleStyles() {
      return this.$store.state.settings.scaleStyles
    }
  },
  mounted () {
    // 获取本地数据，进行画布初始化
    // if (localStorage.getItem('layout')) {
    //   const layout = JSON.parse(localStorage.getItem('layout'))
    //   this.$store.state.app.layout = layout
    // }
    // if (localStorage.getItem('dataOption')) {
    //   const dataOption = JSON.parse(localStorage.getItem('dataOption'))
    //   this.$store.state.app.dataOption = dataOption
    // }
    // if (localStorage.getItem('layoutStyles')) {
    //   const layoutStyles = JSON.parse(localStorage.getItem('layoutStyles'))
    //   this.$store.state.settings.layoutStyles = layoutStyles
    // }
    this.getDashboardData()
    this.saveDashboardToLocal()
    this.recoverDashboard()
    this.setStoreMode(this.$route.query.mode === '1' ? 'preview' : 'edit')
    window.addEventListener('beforeunload', this.beforeunload)
  },
  beforeDestroy() {
    // 百分比重置 默认为100%
    store.dispatch('settings/changeSetting', { key: 'scaleStyles', value: { transform: 'scale(1)', transformOrigin: 'center top' } })
  },
  destroyed() {
    // if (this.timer) {
    //   console.log('destroyed')
    //   clearTimeout(this.timer)
    // }
    // console.log('destroyed')
    // localStorage.removeItem(this.saveName)
    // localStorage.removeItem(this.saveTagName)
    // this.updateStoreData({ layout: [], layoutStyles: [] })
    // this.mode = 'edit'
    // window.removeEventListener('beforeunload', this.beforeunload)
    this.destroyedData()
  },
  methods: {
    recoverDashboard () {
      const saveName = this.saveName
      const saveData = localStorage.getItem(saveName)
      const saveTag = localStorage.getItem(this.saveTagName)
      if (saveData && saveTag !== 'saved') {
        if (this.testNewEmpty()) {
          return
        }
        this.recoverVisible = true
      }
    },
    confirmRecover () {
      const saveName = this.saveName
      const saveData = localStorage.getItem(saveName)
      this.useRecover = true
      console.log(saveData)
      this.updateStoreData(JSON.parse(saveData))
      // store.dispatch('app/updateLayout', JSON.parse(saveData))
      this.resetRecover()
    },
    cancelRecover () {
      this.useRecover = false
      const result = this.dashboard
      const settings = result.setting ? JSON.parse(result.setting) : null
      if (settings) {
        this.updateStoreData(settings)
        // store.dispatch('app/updateLayout', settings)
      }
      this.resetRecover()
    },
    resetRecover () {
      this.recoverVisible = false
      localStorage.removeItem(this.saveName)
      localStorage.removeItem(this.saveTagName)
    },
    async getDashboardData () {
      const id = this.dashboardId
      const from = this.$route.query.from
      if (id) {
        try {
          this.loading = true
          let result = null
          if (from) {
            result = await getTemplateDetail(id)
          } else {
            result = await getDashboardDetail(id)
          }
          this.loading = false
          this.dashboard = result
          if (from && this.$route.query.operation !== 'editTemplate') {
            this.dashboard._id = null
          }
          if (!this.recoverVisible && !this.useRecover) {
            const settings = result.setting ? JSON.parse(result.setting) : null
            if (settings) {
              // store.dispatch('app/updateLayout', settings)
              this.updateStoreData(settings)
            }
          }
        } catch (e) {
          this.loading = false
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
    handleNavbarChange ({ action, data }) {
      if (action === 'changeMode') {
        this.mode = data
        this.setStoreMode(data)
      }
      console.log(action, data)
      if (action === 'saveSuccess') {
        if (!this.dashboardId) {
          localStorage.removeItem(this.saveName)
          localStorage.removeItem(this.saveTagName)
          this.saveName = 'dashboard-' + data._id
          this.saveTagName = this.saveName + '-tag'
          this.dashboardId = data._id
        }
        this.updateLocalStorage('saved')
        this.dashboard = data
      }
      if (action === 'changeShare') {
        this.dashboard = { ...this.dashboard, ...data }
      }
      if (action === 'back') {
        this.handleBack()
      }
    },
    handleBack () {
      const saveTag = localStorage.getItem(this.saveTagName)
      const saveData = localStorage.getItem(this.saveName)
      if (saveTag !== 'saved' && saveData) {
        if (this.testNewEmpty()) {
          this.$router.go(-1)
          return
        }
        this.unsavedVisible = true
      } else {
        this.$router.go(-1)
      }
    },
    confirmBack () {
      this.unsavedVisible = false
      this.$router.go(-1)
    },
    saveDashboardToLocal () {
      console.log('saveDashboardToLocal')
      const saveName = this.saveName
      this.timer = setTimeout(() => {
        if (!this.recoverVisible) {
          const data = {
            layout: this.layout,
            layoutStyles: this.layoutStyles
          }
          const nextData = JSON.stringify(data)
          const saveData = localStorage.getItem(saveName)
          if (saveData) {
            if (!_.isEqual(JSON.parse(nextData), JSON.parse(saveData))) {
              console.log('saveDashboardToLocal12345')
              this.updateLocalStorage('unsaved')
            }
          } else {
            const setting = this.dashboard.setting
            if (setting) {
              if (!_.isEqual(JSON.parse(nextData), JSON.parse(setting))) {
                console.log('123saveDashboardToLocal')
                this.updateLocalStorage('unsaved')
              }
            } else {
              this.updateLocalStorage('unsaved')
              console.log('67723saveDashboardToLocal')
            }
          }
        }
        this.saveDashboardToLocal()
      }, 10 * 1000)
    },
    beforeunload (e) {
      const saveTag = localStorage.getItem(this.saveTagName)
      const saveData = localStorage.getItem(this.saveName)
      if (saveTag !== 'saved' && saveData) {
        if (this.testNewEmpty()) {
          this.destroyedData()
          return
        }
        e.returnValue = '你还没有保存'
      } else {
        this.destroyedData()
      }
    },
    updateLocalStorage (saveTag) {
      const data = {
        layout: this.layout,
        layoutStyles: this.layoutStyles
      }
      localStorage.setItem(this.saveName, JSON.stringify(data))
      localStorage.setItem(this.saveTagName, saveTag)
    },
    updateStoreData (data) {
      const { layout, layoutStyles } = data
      if (layout) {
        store.dispatch('app/updateLayout', layout)
        setTimeout(() => { this.getLayoutRenderData(layout) }, 500)
      }
      if (layoutStyles) {
        store.dispatch('settings/changeSetting', { key: 'layoutStyles', value: layoutStyles })
      }
    },
    // 触发 interReload事件，获取每个图表的渲染数据
    getLayoutRenderData (layout) {
      const idLimits = []
      layout.forEach((item, index) => {
        if (item.is !== 'TabChart') {
          idLimits.push({ id: item.i, limit: (item.option && item.option.limit || 100) + index })
        }
      })
      if (idLimits.length > 0) {
        this.$bus.$emit('interReload', idLimits.map(item => item.id), 1000, true)
      }
    },
    testNewEmpty () {
      if (this.saveName === 'dashboard-new') {
        const saveData = localStorage.getItem(this.saveName)
        if (saveData) {
          const { layout } = JSON.parse(saveData)
          if (layout && layout.length === 0) {
            return true
          }
        }
      }
      return false
    },
    destroyedData () {
      if (this.timer) {
        console.log('destroyed')
        clearTimeout(this.timer)
      }
      console.log('destroyed')
      localStorage.removeItem(this.saveName)
      localStorage.removeItem(this.saveTagName)
      this.updateStoreData({ layout: [], layoutStyles: [] })
      this.mode = 'edit'
      this.setStoreMode('edit')
      window.removeEventListener('beforeunload', this.beforeunload)
    },
    setStoreMode (mode) {
      store.dispatch('app/updateDashboardMode', mode)
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-header {
  position: relative;
}
.main-layout-edit {
  padding: 0px;
  height: calc(100vh - 190px);
}
.main-layout-preview {
  padding: 0px;
  height: calc(100vh - 60px);
}
.gridLayoutExtra {
  padding-bottom: 300px
}
</style>
