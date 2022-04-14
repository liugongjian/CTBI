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
  },
  {
    path: '/dataManage',
    name: 'dataManage',
    redirect: '/dataSource',
    meta: { title: '数据管理', icon: 'dashboard', affix: true },
    component: () => import('@/views/dataManage/index.vue'),
    children: [
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
      }
    ]
  },
  {
    path: '/systemManage',
    name: 'systemManage',
    redirect: '/userManage',
    meta: { title: '系统管理', icon: 'dashboard', affix: true },
    component: () => import('@/views/systemManage/index.vue'),
    children: [
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('@/views/systemManage/userManage.vue'),
        meta: { title: '用户管理', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '仪表盘', icon: 'dashboard', affix: true }
  }
]
export default apps
