<template>
  <el-container v-loading="loading && !recoverVisible">
    <el-container>
      <el-container>
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
    </el-container>
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
import Widget from './Widget/index.vue'
import store from '@/store'
// 导入样式
import '@/views/dashboard/index.scss'
import { getDashboardDetail } from '@/api/dashboard'
export default {
  components: {
    Widget
  },
  data() {
    console.log(this.$route.params.id)
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
    layoutStyles() {
      return this.$store.state.settings.layoutStyles
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
    window.addEventListener('beforeunload', this.beforeunload)
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
    async getDashboardData() {
      const id = this.dashboardId
      if (id) {
        try {
          this.loading = true
          const result = await getDashboardDetail(id)
          console.log(result)
          this.loading = false
          this.dashboard = result
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
    handleNavbarChange({ action, data }) {
      if (action === 'changeMode') {
        this.mode = data
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
    beforeunload() {
      this.destroyedData()
    },
    updateStoreData (data) {
      const { layout, layoutStyles } = data
      if (layout) {
        store.dispatch('app/updateLayout', layout)
      }
      if (layoutStyles) {
        store.dispatch('setting/changeSetting', { key: 'layoutStyles', value: layoutStyles })
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
      window.removeEventListener('beforeunload', this.beforeunload)
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-header{
    position: relative;
}
</style>
