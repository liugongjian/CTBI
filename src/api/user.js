import { http } from '@/config/request'

export function login (data) {
  return http.post('/user/login', data)
}

export function getInfo (token) {
  return http.get('/user/info', { token })
}

export function logout () {
  return http.post('/user/logout')
}
