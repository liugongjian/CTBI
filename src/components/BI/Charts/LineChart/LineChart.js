// 折线图配置项信息
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
  'type': 'trend', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '折线图', // 标题名称
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
      },
      'TitleLink': { // 链接跳转组件
        'text': '', // 文案
        'url': '', // 链接地址
        'show': false, // 是否展示链接地址
        'openType': 'blank' // 打开方式:1.blank 新窗口;2.dialog 弹窗
      },
      'ChartType': { // 图表类型
        'type': 'LineChart' // 线图 面积图 堆积面积图 百分比堆叠面积图
      }
    },
    'ComponentOption': { // 图表样式
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      }
    },
    'Axis': { // 轴设置
      'XAxis': { // X轴设置
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
      'YAxis': { // y轴设置
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
    },
    'FunctionalOption': {
        
    }
  },
  'advance': {}, // 高级
  'dataSource': {}// 数据集
}
