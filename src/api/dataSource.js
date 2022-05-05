import { http } from '@/config/request'
export function getDataSourceList () {
  return http.get('/dataSources')
}

export function getDataFileList () {
  return http.get('/dataFiles')
}

export function postDataSourceList (form) {
  return http.post('/dataSources', form)
}
