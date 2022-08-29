import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from '@/router/base.router'
import store from '@/store'

Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  const role = store.state.user.userData.role
  // 非superUser 和 admin 用户 无权看 模板列表页
  if (to.name === 'template' && role !== 'superUser' && role !== 'admin') {
    next({ path: '/home' })
  } else {
    next()
  }
})
export function resetRouter () {
  const newRouter = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 })
  })
  router.matcher = newRouter.matcher // the relevant part
}
export default router
