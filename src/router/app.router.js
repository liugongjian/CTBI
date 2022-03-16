const apps = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.vue'),
    meta: { title: '首页', icon: 'dashboard', affix: true }
  },
  {
    path: '/gridLayoutDemo',
    name: '拖拽demo',
    component: () => import('@/views/gridLayoutDemo/index.vue'),
    meta: { title: '拖拽demo', icon: 'dashboard', affix: true }
  },
  {
    path: '/sqlEditDemo',
    name: 'sql编辑器demo',
    component: () => import('@/views/sqlEditDemo/index.vue'),
    meta: { title: 'sql编辑器demo', icon: 'dashboard', affix: true }
  }
]
export default apps
