import { http } from '@/config/request'

export function login (data) {
  return http.post('/login', data)
}

export function getInfo (token) {
  return http.post('/checkToken', { token })
}

export function logout () {
  return http.post('/logout')
}

export function verify () {
  return http.get('/verify')
}
export function testTimeout () {
  return http.get('/login/test')
}
