import store from '@/store'
import { customAlphabet } from 'nanoid'

// 生成nanoId
export const createNanoId = function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' // A-Za-z0-9
  const length = 13
  const nanoid = customAlphabet(characters, length)
  return nanoid()
}
/**
 * 对象清空工具
 * @param {Object} obj
 * @returns
 */
export const clearObj = function (obj) {
  for (var key in obj) {
    delete obj[key]
  }
}

export const isEmpty = function (obj) {
  return JSON.stringify(obj) === '{}'
}

export const generateId = function () {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
}

/**
 * 深拷贝
 * @param {Object} origin
 * @returns {Object}
 */
export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin, function (key, val) {
    if (typeof val === 'function') {
      return val + ''
    }
    return val
  }), function (k, v) {
    if (v && v.indexOf && v.indexOf('function') > -1) {
      // eslint-disable-next-line no-eval
      return eval('(function(){return ' + v + ' })()')
    }
    return v
  })
}

/**
 * 浅拷贝
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Object}
 */
export const overwriteObj = function (obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  Object.keys(obj2).forEach((prop) => {
    obj1[prop] = obj2[prop]
  })
}

export const addWindowResizeHandler = function (handler) {
  const oldHandler = window.onresize
  if (typeof window.onresize !== 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

/**
 * 安全获取对象深度层级数据
 * @param {Object} item
 * @param {string} keys
 * @returns {Object}
 */
export const getParameter = function (item, keys) {
  let result = null
  if (item && keys) {
    const keyList = keys.split('.')
    // 无可用键直接退出
    if (keyList.length > 0) {
      if (item.option) {
        result = item.option
      } else {
        result = item
      }
      // 可以换成递归
      keyList.forEach((key) => {
        if (result === null || result === undefined) {
          return
        }
        result = result[key]
      })
    }
  }
  return result
}

/**
 * 通过id获取vuex中的layout数据
 * @param {string} identify
 * @returns {Object}
 */
export const getLayoutById = function (identify) {
  const layout = store.state.app.layout
  const obj = layout.find((item) => {
    return item.i === identify
  })
  return obj
}

/**
 * 通过id获取vuex中的layout数据
 * @param {string} identify
 * @returns {Object}
 */
export const getCurrentLayout = function () {
  const identify = store.state.app.currentLayoutId
  if (!identify) {
    return {}
  }
  return getLayoutById(identify)
}

/**
 * 通过id获取vuex中的layout数据
 * @param {string} identify
 * @returns {Object}
 */
export const getLayoutOptionById = function (identify) {
  if (!identify) {
    identify = store.state.app.currentLayoutId
  }
  const layout = store.state.app.layout
  const obj = layout.find((item) => {
    return item.i === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj.option
  }
  console.warn(`获取 ${identify} 组件配置信息为空`)
  return {}
}
export const getCurrentLayoutOption = function () {
  const identify = store.state.app.currentLayoutId
  if (!identify) {
    return {}
  }
  return getLayoutOptionById(identify)
}

/**
 * 通过id获取vuex中的dataValue数据
 * @param {string} identify
 * @returns {Object}
 */
export const getDataValueById = function (identify) {
  if (!identify) {
    identify = store.state.app.currentLayoutId
  }
  const dataOption = store.state.app.dataOption
  const obj = dataOption.find((item) => {
    return item.id === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj.dataValue
  }
  console.warn(`获取 ${identify} 组件数据信息为空`)
  return null
}

/**
 * 获取当前时间 格式为 yyyy - mm - dd hh : mm : ss
 */
export const getDateTime = () => {
  const getDate = new Date()
  const dateYear = getDate.getFullYear()
  let dateMonth = getDate.getMonth() + 1
  let dateDate = getDate.getDate()
  let dateHours = getDate.getHours()
  let dateMinutes = getDate.getMinutes()
  let dateSeconds = getDate.getSeconds()
  dateMonth = dateMonth < 10 ? '0' + dateMonth : dateMonth
  dateDate = dateDate < 10 ? '0' + dateDate : dateDate
  dateHours = dateHours < 10 ? '0' + dateHours : dateHours
  dateMinutes = dateMinutes < 10 ? '0' + dateMinutes : dateMinutes
  dateSeconds = dateSeconds < 10 ? '0' + dateSeconds : dateSeconds
  return dateYear + '-' + dateMonth + '-' + dateDate + ' ' + dateHours + ':' + dateMinutes + ':' + dateSeconds
}

/**
 * 将维度和度量的数据进行转换为图表需要的数据
 * @param {Array} data
 * @returns {Array}
 */
export const formatDataValue = function (chartData) {
  const dataValue = []
  const DimensionKey = []
  const MeasureKey = []
  const { data, fields } = chartData
  if (data && data.length > 0) {
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        const element = fields[key]
        if (key === 'Dimension') {
          element.fields.forEach(field => {
            DimensionKey.push(field.displayColumn)
          })
        } else if (key === 'Measure') {
          element.fields.forEach(field => {
            MeasureKey.push(field.displayColumn)
          })
        }
      }
    }
    dataValue.push([DimensionKey.join('-'), ...MeasureKey])
    data.forEach(item => {
      const dimensionData = []
      const measureData = []
      DimensionKey.forEach(dim => {
        dimensionData.push(item[dim])
      })
      MeasureKey.forEach(mea => {
        measureData.push(item[mea].match(/\d+(?:\.\d+)?/g, ''))
      })
      dataValue.push([dimensionData.join('-'), ...measureData])
    })
  }
  return dataValue
}

/**
 * 将字段类型转换为图标
 * @param {String} type
 * @returns {String}
 */
export const transformDataTypeIcon = function (data) {
  let type = data
  if (type) {
    if (typeof type !== 'string') {
      type = data[0].dataType || ''
    }
    if (type.indexOf('text') > -1 ||
      type.indexOf('char') > -1 ||
      type.indexOf('varChar') > -1 ||
      type.indexOf('varchar') > -1) {
      return 'data-type-option-text'
    } else if (type.indexOf('date') > -1 || type.indexOf('time') > -1) {
      return 'data-type-option-date'
    } else if (type.indexOf('int') > -1 ||
      type.indexOf('number') > -1 ||
      type.indexOf('float') > -1) {
      return 'data-type-option-number'
    } else if (type.indexOf('granularity') > -1 ||
      type.indexOf('area') > -1 ||
      type.indexOf('province') > -1 ||
      type.indexOf('city') > -1 ||
      type.indexOf('country') > -1 ||
      type.indexOf('longitude') > -1 ||
      type.indexOf('dimensionality') > -1) {
      return 'el-icon-location-information'
    }
  }
  return ''
}

/**
 * 将字段数据转换为需要的格式
 * @param {*} fields
 * @returns
 */
export const getFieldsTree = (fields) => {
  if (!fields) return []
  const res = [{
    _id: 1,
    displayColumn: '维度',
    icon: 'dimension-icon',
    index: 'dimension_p_1',
    children: []
  }, {
    _id: 2,
    index: 'measure_p_1',
    icon: 'measure-icon',
    displayColumn: '度量',
    children: []
  }]

  return res
}

/**
 * 将字段数据转换为需要的格式
 * @param {*} fields
 * @returns
 */
export const getFieldsTable = (fields) => {
  if (!fields) return []
  const res = [{
    _id: 1,
    displayColumn: '维度',
    icon: 'dimension-icon',
    index: 'dimension_p_1',
    children: []
  }, {
    _id: 2,
    index: 'measure_p_1',
    icon: 'measure-icon',
    displayColumn: '度量',
    children: []
  }]
  let dimensionHiddenLength = 0
  let measureHiddenLength = 0
  fields.forEach((item, index) => {
    item.index = item.type + '_' + index
    if (!item.displayColumn) {
      item.displayColumn = item.column
    }
    item.attributes[0].displayColumn = item.displayColumn
    // 赋值描述字段
    if (!item.attributes[0].comment) {
      item.attributes[0].comment = ''
    }
    // 默认展示格式
    if (!item.attributes[0].format) {
      item.attributes[0].format = ''
    }
    // 默认聚合方式
    if (!item.attributes[0].aggregator) {
      item.attributes[0].aggregator = 'sum'
    }
    if (item.type === 'Dimension') {
      if (item.attributes[0].isHidden) {
        dimensionHiddenLength += 1
      } else if (typeof item.attributes[0].isHidden === 'undefined') {
        // 接口没有返回值时需要自行添加，不然放到按钮上无法绑定数据，导致问题
        item.attributes[0].isHidden = false
      }
      res[0].children.push(item)
    } else if (item.type === 'Measure') {
      if (item.attributes[0].isHidden) {
        measureHiddenLength += 1
      } else if (typeof item.attributes[0].isHidden === 'undefined') {
        // 接口没有返回值时需要自行添加，不然放到按钮上无法绑定数据，导致问题
        item.attributes[0].isHidden = false
      }
      res[1].children.push(item)
    }
  })
  if (res[1].children.length === 0 || res[1].children.length === measureHiddenLength) {
    res[1].isHidden = true
  }
  if (res[0].children.length === 0 || res[0].children.length === dimensionHiddenLength) {
    res[0].isHidden = true
  }
  return res
}

// 获取数据集查询数据接口的参数
export const getQueryParams = (limit, identify) => {
  let option = {}
  if (identify) {
    option = getLayoutOptionById(identify)
  } else {
    option = getCurrentLayoutOption()
  }
  const { dataSource } = option
  // 维表字段
  const dimension = { selections: [] }
  // 度量字段字段
  const measure = { selections: [] }
  // 字段统计，用于做回显
  const transformFields = {}
  for (const key in dataSource) {
    const source = dataSource[key]
    // TODO：需要定义组件配置type类型来替换用名称做判断
    if (key.toLocaleLowerCase().indexOf('dimension') > -1) {
      dimension.selections = dimension.selections.concat(source.value.map(so => { return { ...so, fieldId: so._id, attributeId: so.attributes[0]._id } }))
    }
    if (key.toLocaleLowerCase().indexOf('measure') > -1) {
      measure.selections = measure.selections.concat(source.value.map(so => { return { ...so, fieldId: so._id, attributeId: so.attributes[0]._id } }))
    }
    transformFields[key] = {
      'name': source.name,
      'fields': source.value
    }
  }
  // 过滤
  const filter = { selections: [] }
  // 排序
  const order = []
  // 查询数据的偏移量默认0
  const offset = 0
  // sql-参数配置中的
  const placeholder = { configs: [] }
  // sql-参数配置中的
  const param = { configs: [] }
  return { query: { limit, dimension, measure, filter, order, offset, placeholder, param }, dataSetId: option.dataSet?.id, transformFields }
}
