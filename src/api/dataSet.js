import { http } from '@/config/request'

// 创建文件夹
export function createFolders (data) {
  return http.post('/folders', data)
}

// 获取 数据集 & 文件夹 列表
/**
 * 该API不分页
 * 如无查询条件，列表包含文件夹、数据集
 * 如有查询条件，列表返回数据集
 **/
export function getDataSetsFolders (data = {}) {
  return http.get('/dataSets', data)
}

// 根据ID查询数据集详情
export function getDataSetsInfo (id) {
  return http.get(`/dataSets/${id}`)
}

// 重命名文件夹 更新
export function updateFolderName (id, body) {
  return http.put(`/folders/${id}`, body)
}

// 删除文件夹
export function delFolders (id) {
  return http.delete(`/folders/${id}`)
}

// 查询文件夹列表
export function getFolderLists (
  params = {
    searchkey: '',
    type: 'dataSet'
  }
) {
  return http.get(`/folders`, params)
}

// 更新数据集
export function updateDataSet (id, params) {
  return http.put(`/dataSets/${id}`, params)
}

// 删除数据集
export function delDataSet (id) {
  return http.delete(`/dataSets/${id}`)
}

// 移动数据集到文件夹
export function moveDataSet2Folder (body) {
  return http.put(`/dataSets/move`, body)
}

// 运行sql
export function runtimeForSql (body) {
  return http.post(`/sql/exec`, body)
}

// sql的运行记录
export function getSqlRunningLogs (id) {
  return http.get(`/sql/${id}/history`)
}

// 预览数据
export function getPreviewData (body) {
  return http.post(`/dataSets/preview`, body)
}

// 解析sql参数
export function getSqlVariables (body) {
  return http.post(`/sql/extractVariables`, body)
}

// 获取数据源列表
export function getDataSourceData () {
  return http.get(`/dataSources`)
}

// 创建/更新sql
export function createUpdateSql (body) {
  return http.post(`/sql`, body)
}

// 创建数据集
export function createDataSets (body) {
  return http.post(`/dataSets`, body)
}

// 获取 sql 相关所有数据
export function getSqlAllData (id) {
  return http.get(`/sql/${id}`)
}

// 确认编辑 sql
export function confirmEditSql (body) {
  return http.post(`/sql/confirm`, body)
}

// 获取指定数据源的 数据表
export function getDataTable (id) {
  return http.get(`/dataSources/${id}/tables`)
}

// 获取指定数据源的 数据表
export function dataFiles (params) {
  return http.get(`/dataFiles`, params)
}

// 查表详情
export function getTableInfo (id, tableName) {
  return http.get(`/dataSources/${id}/table/info`, { tableName })
}
export function getFileTableInfo (tableName) {
  return http.get(`/dataFiles/table/info`, { tableName })
}

// 查询数据集详情
export function getDataSetData (id) {
  return http.get(`/dataSets/${id}`)
}
