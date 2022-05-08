import { http } from '@/config/request'

// 获取仪表板列表
export function getDashboardList(data) {
  return http.get('/dashboard/list', data)
}
