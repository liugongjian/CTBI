<template>
  <el-container v-loading="loading && !recoverVisible">
    <el-container>
      <el-container>
        <!-- 画布主体 -->
        <el-main
          class="main-layout-preview"
          :style="layoutStyles"
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
    </el-container>
    <el-dialog
      title="请输入分享密码"
      :visible.sync="passwordVisible"
      :close-on-click-modal="false"
      width="480px"
    >
      <el-form
        ref="attrForm"
        style="padding: 0px"
        :model="dashboardAttr"
        :rules="attrRules"
        label-width="60px"
      >
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="dashboardAttr.password"
            placeholder="请输入分享密码"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="passwordVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmGetData"
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
import { getShareDashboardDetail } from '@/api/dashboard'
import { encryptAesForShare } from '@/utils/encrypt'
export default {
  components: {
    Widget
  },
  data () {
    console.log(this.$route.params.id)
    const dashboardId = this.$route.query.id || ''
    this.timer = null
    this.saveName = 'dashboard-' + (dashboardId || 'new')
    this.saveTagName = this.saveName + '-tag'
    return {
      loading: false,
      passwordVisible: false,
      dashboardAttr: {
        password: ''
      },
      attrRules: {
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ]

      }
    }
  },
  computed: {
    layout () {
      return store.state.app.layout
    },
    layoutStyles () {
      return this.$store.state.settings.layoutStyles
    }
  },
  created () {
    const paths = location.pathname.split('/')
    const needPwd = paths[paths.length - 1].length === 15
    if (needPwd) {
      this.passwordVisible = true
    } else {
      this.getDashboardData()
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
    // this.getDashboardData()
    window.addEventListener('beforeunload', this.beforeunload)
    store.dispatch('app/updateDashboardMode', 'preview')
  },
  destroyed () {
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
    async getDashboardData () {
      // const params = {
      //   url: 'http://43.142.102.49:888/ctbiweb/dashboard/publish/RGvgccuxEsP5RLj' || window.location.href,
      //   password: this.dashboardAttr.password,
      //   date: moment().format('YYYY-MM-DD')
      // }
      const params = {
        url: window.location.href,
        password: this.dashboardAttr.password ? encryptAesForShare(this.dashboardAttr.password) : ''
        // date: moment().format('YYYY-MM-DD')
      }
      try {
        this.loading = true
        const result = await getShareDashboardDetail(params)
        console.log(result)
        this.loading = false
        this.dashboard = result
        this.passwordVisible = false
        store.dispatch('app/updateShareDashboardInfo', { ...params })
        this.updateStoreData(JSON.parse(result.setting))
      } catch (e) {
        this.loading = false
      }
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
      console.log(idLimits)
      idLimits.forEach(item => {
        this.$bus.$emit('interReload', [item.id], item.limit, true)
      })
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
    beforeunload () {
      this.destroyedData()
    },
    confirmGetData () {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          this.getDashboardData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      store.dispatch('app/updateShareDashboardInfo', {})
      store.dispatch('app/updateDashboardMode', 'edit')
      window.removeEventListener('beforeunload', this.beforeunload)
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-header {
  position: relative;
}
::v-deep .el-dialog__footer {
  padding: 0px;
}
.dialog-footer {
  padding-top: 10px;
}
.main-layout-preview {
  padding: 0px;
  height: 100vh;
}
</style>
