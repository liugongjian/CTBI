
export default {
  /**
   * 安全获取对象深度层级数据
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
  },

  /**
   * 对象清空工具
   * @param {Object} obj
   * @returns
   */
  clearObj (obj) {
    for (var key in obj) {
      delete obj[key]
    }
  },

  /**
   * 饼图的数据合并，生成echarts可识别的参数
   * 这里最好做合并工作，最好不要直接赋值
   * @param {Object} obj
   * @returns {Object}
   */
  pie (obj) {
    return {
      'tooltip': obj.Tooltip,
      'legend': obj.Legend,
      'series': [
        {
          'type': obj.ChartType,
          'radius': obj.ChartRadius,
          'data': [
            {
              'value': 1048,
              'name': 'Search Engine'
            },
            {
              'value': 735,
              'name': 'Direct'
            },
            {
              'value': 580,
              'name': 'Email'
            },
            {
              'value': 484,
              'name': 'Union Ads'
            },
            {
              'value': 300,
              'name': 'Video Ads'
            }
          ],
          'emphasis': {
            'itemStyle': {
              'shadowBlur': 10,
              'shadowOffsetX': 0,
              'shadowColor': 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }
}
