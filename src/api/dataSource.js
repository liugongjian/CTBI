import { http } from '@/config/request'
export function getDataSourceList (params) {
  return http.get('/dataSources', params)
}

export function uploadDataFile (param) {
  return http.post('/dataFiles', param)
}

export function isDataFileExists (param) {
  return http.get('dataFiles/exists', param)
}

export function getDataFiles (param) {
  return http.get('/dataFiles', param)
}

export function deleteDataFile (id) {
  return http.delete(`/dataFiles/${id}`)
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

export function detailSource(params) {
  return http.get(`/dataSources/${params.id}/table/info`, params)
}
// 上传图片
export function uploadImg(data) {
  return http.post('/dataFiles/img', data)
}

// 获取图片
export function downloadImg(path) {
  return http.get(`/dataFiles/img?path=${path}`)
}
