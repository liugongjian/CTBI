import { http } from '@/config/request'

// 获取模板列表
export function getTemplateList(params) {
  return http.get(`/template/list`, params)
}

// 新增模板
export function addTemplate (data) {
  return http.post(`/template/add`, data)
}

// 删除模板
export function deleteTemplate (id) {
  return http.put(`/template/${id}/delete`)
}

// 获取模板详情
export function getTemplateDetail (id) {
  return http.get(`/template/${id}`)
}

// 获取模板详情
export function updateTemplateContent (data) {
  return http.post(`/template/updateTemplate`, data)
}
