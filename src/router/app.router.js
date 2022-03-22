const apps = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.vue'),
    meta: { title: '首页', icon: 'dashboard', affix: true }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/components/Editor/index.vue'),
    meta: { title: 'SQl', icon: 'dashboard', affix: true }
  },
  {
    path: '/bi',
    name: 'bi',
    component: () => import('@/views/bi/index.vue'),
    meta: { title: '报表', icon: 'dashboard', affix: true }
  }
]
export default apps
