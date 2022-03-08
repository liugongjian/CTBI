import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from '@/router/base.router'

Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()

export default router
