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

// 获取分享信息
export function getShareInfo (id) {
  return http.get(`/dashboard/${id}/shareInfo`)
}

// 分享仪表板
export function shareDashboard (body) {
  return http.post(`/dashboard/share`, body)
}

// 取消分享信息
export function cancelShareDashboard (id) {
  return http.put(`/dashboard/${id}/shareInvalid`)
}

// 移动仪表板到文件夹
export function moveDashboardToFolder (body) {
  return http.post(`/dashboard/moveDashboardToFolder`, body)
}

// 文件夹重命名和更新仪表板属性
export function updateFolderOrDashboardProperties (body) {
  return http.post(`/dashboard/updateFolderOrDashboardProperties`, body)
}

// 获取文件夹树状结构
export function getFolderTree () {
  return http.get(`/dashboard/getFolderTree`)
}

// 保存或者创建看板
export function saveDashboard (body) {
  return http.post(`/dashboard/saveDashboard`, body)
}

// 发布看板
export function publishDashboard (id) {
  return http.put(`/dashboard/${id}/publishDashboard`)
}

// 获取仪表板详情
export function getDashboardDetail (id) {
  return http.put(`/dashboard/${id}`)
}

