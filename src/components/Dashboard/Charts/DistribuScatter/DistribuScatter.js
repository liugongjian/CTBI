/*
* 分布散点图
* */
import { colorTheme } from '@/constants/color.js'
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  order: 5,
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '分面散点图', // 标题名称
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
        'color': colorTheme['官方'],
        'theme': '官方'
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
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
    },
    'SeriesSetting': { // 系列设置
      'SeriesSelect': { // 选择系列
        'label': '请选择系列',
        'selectValue': '', // 默认选择的系列名字 第一个元素
        'remarkShow': true, // 是否显示别名
        'remark': '', // 别名默认是选择的系列名字 第一个元素
        'seriesOption': []
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'MeasureSecond': {
      'name': 'Y轴/度量',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': {
      'name': 'X轴/度量',
      'require': true,
      'limit': 10,
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
