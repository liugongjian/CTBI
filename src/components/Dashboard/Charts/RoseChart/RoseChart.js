// 玫瑰图配置项信息
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
  'type': 'distribution', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 2, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '玫瑰图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '玫瑰图', // 标题名称
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
      'TitleLink': { // 链接跳转组件
        'text': '', // 文案
        'url': '', // 链接地址
        'show': false, // 是否展示链接地址
        'openType': 'blank' // 打开方式:1.blank 新窗口;2.dialog 弹窗
      }
    },
    'ComponentOption': { // 图表样式
      'ChartLabel': { // 标签样式
        'type': 'PieChart', // 饼图标签样式
        'check': true, // 选中显示标签
        'checkList': ['维度', '百分比'],
        'precision': 2, // 百分比保留位数 0位 1位 2位
        'labelShow': 1 // 0不显示 1 智能显示 2 全部显示
      },
      'ChartRadius': ['0%', '45%'], // 饼图半径
      'Color': { // 颜色设置
        'title': '配色设置',
        'color': colorTheme['官方'],
        'theme': '官方'
      },
      'MergeOther': { // 合并数据为其他
        'show': false, // 是否选中
        'num': null
      },
      'TotalShow': { // 显示总计
        'show': false, // 是否选中
        'name': '总计', // 自定义的总计名字
        'value': 0 // 总计数量
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      }
    },
    'SeriesSetting': { // 系列设置
      'SeriesSelect': { // 选择系列
        'label': '请选择系列',
        'selectValue': '', // 默认选择的系列名字 第一个元素
        'remarkShow': true, // 是否显示别名
        'remark': '', // 别名默认是选择的系列名字 第一个元素
        'seriesOption': [] // 从数据中拿到系列的名字
      }
    },
    'FunctionalOption': { // 功能配置
      'ChartFilter': {
        'showFilter': false,
        'selectedIndicator': '', // 选中的指标
        'indicatorOption': [] // 指标集合
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '扇区标签/维度',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': '扇区角度/度量',
      'require': true,
      'limit': 10,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}

