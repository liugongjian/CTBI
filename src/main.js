import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//global icon
import '@/icons'
// 路由守卫
import '@/config/permission'
// global css
import '@/styles/index.scss'
// 引入全局过滤器
import '@/filters/index'
// 引入弹窗指令化
import initDialogs from '@/config/dialog'
initDialogs(Vue)
// 引入echarts
import * as echarts from 'echarts'
// v-echarts
import VECharts from 'vue-echarts'
Vue.component('v-chart', VECharts)
// 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 全局组件自动注册 icons中全局注册了svg-icon组件，打开此注册时需去除
// import '@/components/autoRegister'
// 自定义指令
import directive from '@/utils/directive'
directive(Vue)

Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.prototype.$bus = new Vue()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
