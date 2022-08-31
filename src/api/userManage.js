import { http } from '@/config/request'

export function getList (params) {
  return http.get(`/users`, params)
}

export function logOffUser (id) {
  return http.put(`/users/${id}/logoff`)
}

export function resetUser (id, params) {
  return http.put(`/users/${id}/reset`, params)
}

export function unfreezeUser (id) {
  return http.put(`/users/${id}/unfreeze`)
}

export function createUser (params) {
  return http.post(`/users`, params)
}

export function editUser (id, params) {
  return http.put(`/users/${id}`, params)
}

export function exists (params) {
  return http.post(`/users/exists`, params)
}
