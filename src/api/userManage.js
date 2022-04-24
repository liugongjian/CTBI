import { http } from '@/config/request'
const prefix = '/user-api'

export function getList (params) {
  return http.get(`${prefix}/users`, params)
}

export function logOffUser (id) {
  return http.put(`${prefix}/users/${id}/logoff`)
}

export function resetUser (id, params) {
  return http.put(`${prefix}/users/${id}/reset`, params)
}

export function unfreezeUser (id) {
  return http.put(`${prefix}/users/${id}/unfreeze`)
}

export function createUser (params) {
  return http.post(`${prefix}/users`, params)
}

export function editUser (id, params) {
  return http.put(`${prefix}/users/${id}`, params)
}

export function exists (params) {
  return http.post(`${prefix}/users/exists`, params)
}
