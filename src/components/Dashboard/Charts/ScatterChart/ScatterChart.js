/*
* 散点图
* */
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 3, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'name': '散点图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '散点图', // 标题名称
        'color': '#333', // 标题颜色
        'show': true, // 是否显示标题
        'testShow': false // 测试显示
      },
      'Mark': { // 备注
        'show': false, // 是否显示备注
        'position': 'onChart', // 备注出现位置
        'text': ''// 备注信息
      },
      'Footer': { // 尾注
        'show': false, // 是否显示尾注
        'text': ''// 尾注信息
      }
    },
    'ComponentOption': {
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'Slider': { // 数据点大小
        'symbolSize': 8, // 默认大小
        'minSize': 2, // 最小值
        'maxSize': 16 // 最大值
      }
    },
    'Axis': {
      'XAxis': {
        'cname': 'X轴',
        'title': '',
        'unit': '',
        'show': true,
        'showTitle': false,
        'showTicks': false,
        'lineWidth': 1,
        'lineColor': '#000',
        'lineType': 'solid',
        'showAxisLabel': true,
        'showSplit': false,
        'splitWidth': 1,
        'splitColor': '#000',
        'splitType': 'solid'
      },
      'YAxis': {
        'cname': '左Y轴',
        'title': '',
        'unit': '',
        'show': true,
        'showTitle': false,
        'showTicks': false,
        'lineWidth': 1,
        'lineColor': '#000',
        'lineType': 'solid',
        'showAxisLabel': true,
        'showSplit': false,
        'splitWidth': 1,
        'splitColor': '#000',
        'splitType': 'solid',
        'min': 0,
        'max': 0,
        'autoMin': true,
        'autoMax': true,
        'formatType': '1',
        'lang': 'chinese-simplified',
        'numberFormat': 'number',
        'numberDigit': 0,
        'kSeperator': false,
        'formatRegx': ''
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': 'X轴/维度或度量',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': 'Y轴/度量',
      'require': true,
      'limit': 1,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}
