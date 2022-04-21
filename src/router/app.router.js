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
    path: '/dashboard/',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '仪表盘', icon: 'dashboard', affix: true }
  },
  {
    path: '/dataSource',
    name: 'dataSource',
    component: () => import('@/views/dataManage/dataSource.vue'),
    meta: { title: '数据源', icon: 'dashboard', affix: true }
  },
  {
    path: '/dataSet',
    name: 'dataSet',
    component: () => import('@/views/dataManage/dataSet.vue'),
    meta: { title: '数据集', icon: 'dashboard', affix: true }
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: () => import('@/views/systemManage/userManage.vue'),
    meta: { title: '账号管理', icon: 'dashboard', affix: true }
  }
]
export default apps
