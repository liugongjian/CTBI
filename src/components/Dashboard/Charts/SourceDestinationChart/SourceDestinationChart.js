/**
 * type: {
 *    indicator: 指标,
 *    table: 表格,
 *    trend: 趋势，
 *    comparator: 比较
 *    distribution: 分布
 *    relation: 关系
 *    space: 空间
 *    sequence: 时序
 *    storyline: 故事线
 *    other: 其他
 *  }
 * */
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 6,
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '来源去向图', // 标题名称
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
    'ComponentOption': {
      'Color': { // 颜色设置
        'title': '数据设置',
        'theme': '官方'
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '中心节点/维度',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': '值轴/度量',
      'require': true,
      'limit': 1,
      'value': []
    }
    // 'Dimension': {
    //   'name': '颜色图例维度',
    //   'require': false,
    //   'limit': 1,
    //   'value': []
    // }
  }, // 数据集
  'dataSet': {
    'id': '',
    'name': ''
  }
}
