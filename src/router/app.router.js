const apps = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.vue'),
    meta: { title: '首页', icon: 'dashboard', affix: true }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
    meta: { title: 'demo', icon: 'dashboard', affix: true }
  }
]
export default apps
