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
import { colorTheme } from '@/constants/color.js'
export default {
  'type': 'table', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '明细表', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '明细表', // 标题名称
        'color': '#333', // 标题颜色
        'show': true // 是否显示标题
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
      'TitleLink': {
        'show': false
      },
      'Edition': {
        'edition': 'newEdition' // 版本切换
      }
    },
    'DisplayConfig': {
      'TableTheme': {
        'colorType': 'themeColor',
        'show': false,
        'active': 'stripe' // stripe 斑马 border 线框 simple 简版 verySimple 极简
      },
      // 'TableThemeSimple': {
      //   'show': true,
      //   'type': 'default'
      // },
      'ListHeader': {
        'head': false
      },
      'Color': { // 颜色设置
        'title': '配色设置',
        'color': colorTheme['官方'],
        'theme': '官方',
        'show': false
      },
      'Sequence': { // 是否显示序号
        'show': false,
        'name': '序号'
      },
      'MergeForm': {
        'show': false
      },
      'Freeze': {
        'show': false,
        'freezeChoose': 'arrange',
        'positive': 0,
        'reverse': 0
      },
      'NewLine': {
        'show': false
      },
      'PaginationSettor': {
        'disable': false,
        'show': true,
        'pageSize': 10
      },
      'IndicatorGroup': {
        'show': false
      },
      'ColumnWidth': {
        'type': 'selfadapting'
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'DimensionOrMeasure': { // 维度
      'name': '数值列/维度或度量',
      'require': false,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}
