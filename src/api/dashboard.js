import { http } from '@/config/request'

// 获取仪表板列表
export function getDashboardList(data) {
  return http.get('/dashboard/list', data)
}

// 创建文件夹
export function createFolder (body) {
  return http.post(`/dashboard/createFolder`, body)
}

// 删除仪表板和文件夹
export function batchDeleteResources (body) {
  return http.post(`/dashboard/batchDeleteResources`, body)
}

// 批量下线仪表板
export function batchCancelPublishDashboards (body) {
  return http.post(`/dashboard/batchCancelPublishDashboards`, body)
}
