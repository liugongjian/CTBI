import { http } from '@/config/request'
export function getDataSourceList () {
  return http.get('/dataSources')
}

export function postDataSourceList (form) {
  return http.post('/dataSources', form)
}

export function getSourceFile(id, getDataFileList) {
  // id = 'GKZIs8GEYhkV1'
  return http.get(`/dataSources/${id}/tables`, getDataFileList)
}

export function deleteSources(id) {
  return http.delete(`/dataSources/${id}`)
}

export function editSources(id, body) {
  return http.put(`/dataSources/${id}`, body)
}

export function connectTest(body) {
  return http.post(`/dataSources/link`, body)
}
