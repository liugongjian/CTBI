// 饼图配置项信息
export default {
  'type': '', // 组件类型
  'isShow': true, // 是否展示该组件
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '饼图', // 标题名称
        'color': '#333', // 标题颜色
        'show': true, // 是否显示标题
        'testShow': false // 测试显示
      },
      'TestTitle': { // 测试组件间交互组件
        'testShow': false
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
    'ComponentOption': { // 图表样式
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'ChartRadius': ['0%', '45%'] // 饼图半径
    }
  },
  'advance': {}, // 高级
  'dataSource': {}// 数据集
}
