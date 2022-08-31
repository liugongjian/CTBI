import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import { getAsyncRoutes } from '@/utils/asyncRouter.js'
// import { errorPageRoutes } from '@/router/base.router'
// import { resetRouter } from '../router'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/login/activate'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path.indexOf('/login') > -1) {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next({ ...to, replace: true })
          // // 获取用户角色
          // const userRoute = await store.state.user.routes
          // // 判断store中是否存在需要添加的路由
          // if (userRoute && userRoute.length) {
          //   const accessRoutes = getAsyncRoutes(await store.state.user.routes)
          //   // 动态添加路由到router内
          //   const singleRoutes = []
          //   const multiRoutes = []
          //   for (const item of accessRoutes) {
          //     if (item.children && item.children.length) {
          //       multiRoutes.push(item)
          //     } else {
          //       singleRoutes.push(item)
          //     }
          //   }
          //   if (singleRoutes.length) {
          //     // 当不存在子路由时，将动态路由添加到'/'路由的子路由中
          //     if (router.options.routes[0].path === '/') {
          //       router.options.routes[0].children.push(...singleRoutes)
          //       const routes = router.options.routes
          //       // 重置路由 防止动态添加路由重复
          //       resetRouter()
          //       routes.forEach(item => {
          //         router.addRoute(item)
          //       })
          //     }
          //   }
          //   if (multiRoutes.length) {
          //     multiRoutes.forEach(item => {
          //       router.addRoute(item)
          //     })
          //   }
          // }
          // // 动态添加错误页面路由
          // router.addRoute(...errorPageRoutes)
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1 || to.path.includes('/dashboard/publish/')) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
