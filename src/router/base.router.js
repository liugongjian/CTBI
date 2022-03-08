import store from '@/store'
import Layout from '@/layout/index.vue'
import apps from '@/router/app.router'
/**
* Note: sub-menu only appear when route children.length >= 1
* Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*
* hidden: true                   if set true, item will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu
*                                if not set alwaysShow, when item has more than one children route,
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
   roles: ['admin','editor']    control the page roles (you can set multiple roles)
   title: 'title'               the name show in sidebar and breadcrumb (recommend set)
   icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
   noCache: true                if set true, the page will no be cached(default is false)
   affix: true                  if set true, the tag will affix in the tags-view
   breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
   activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
*/

/**
* constantRoutes
* a base page that does not have permission requirements
* all roles can be accessed
*/

// 定义公共路由
export const constantRoutes = [
  {
    path: '/',
    redirect: store.getters['menuPath'],
    component: Layout,
    children: [
      ...apps
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index')
  }
]

export const errorPageRoutes = [
  {
    path: '*',
    component: Layout,
    redirect: '/404',
    name: 'ErrorPages',
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  }
]

