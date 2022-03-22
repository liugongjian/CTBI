
export default {
  /**
   * @param {Object} item
   * @param {string} keys
   * @returns {Object}
   */
  getParameter: function (item, keys) {
    let result = null
    if (item || keys) {
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
}
