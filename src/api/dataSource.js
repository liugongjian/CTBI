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

export function getSourceFile(id) {
  id = 'GKZIs8GEYhkV1'
  return http.get(`/dataSources/${id}/tables`)
}

export function deleteSources(id) {
  return http.delete(`/dataSources/${id}`)
}
