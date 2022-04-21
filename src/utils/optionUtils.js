import store from '@/store'
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

  return JSON.parse(JSON.stringify(origin))
}

/**
   * 浅拷贝
   * @param {Object} obj1
   * @param {Object} obj2
   * @returns {Object}
   */
export const overwriteObj = function (obj1, obj2) { /* 浅拷贝对象属性，obj2覆盖obj1 */
  Object.keys(obj2).forEach(prop => {
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
      keyList.forEach(key => {
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
  const obj = layout.find(item => {
    return item.i === identify
  })
  return obj
}

/**
   * 通过id获取vuex中的layout数据
   * @param {string} identify
   * @returns {Object}
   */
export const getLayoutOptionById = function (identify) {
  const layout = store.state.app.layout
  const obj = layout.find(item => {
    return item.i === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj.option
  }
  console.warn(`获取 ${identify} 组件配置信息为空`)
  return {}
}

export const getLinkageById = function (identify) {
  const linkage = store.state.app.linkage
  const obj = linkage.find(item => {
    return item.id === identify
  })
  if (obj && JSON.stringify(obj) !== '{}') {
    return obj
  }
  console.warn(`获取 ${identify} 组件配置信息为空`)
  return {}
}
