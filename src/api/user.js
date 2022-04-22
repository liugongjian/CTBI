import { http } from '@/config/request'

export function login (data) {
  return http.post('/login', data)
}

export function getInfo (token) {
  return http.get('/checkToken', { token })
}

export function logout () {
  return http.post('/user/logout')
}

export function verify () {
  return http.get('/verify')
}
