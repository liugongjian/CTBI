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
      'ChartLabel': { // 标签样式
        'type': 'LineChart', // 线图标签样式
        'check': false, // 选中显示标签
        'checkList': [],
        'precisionShow': false, // 是否显示百分比设置组件
        'precision': 2, // 百分比保留位数 0位 1位 2位
        'labelShow': 1 // 0不显示 1 智能显示 2 全部显示
      },
      'SeriesMark': { // 标记点
        'show': true, // 这里一直是true 和系列中的标记区分
        'check': false, // 默认未选中
        'markType': 'circle'
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'LineStyle': { // 线条样式
        'type': 2 // 1曲线 2直线
      },
      'Color': { // 颜色设置
        'title': '配色设置',
        'color': colorTheme['defaultColor']
      },
      'TwisYAxis': { // 双Y轴
        'show': false, // 是否显示双Y轴
        'twisType': 'syncTicksNum' // 双Y轴类型 1.syncNull 不同步；2.syncTicksNum 刻度数量一致；3.syncAll 刻度数量&数值一致
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
      'DataZoom': {
        'showDataZoom': 'hide'
      },
      'LabelShowType': {
        'axisShowType': 'auto'
      },
      'NullProcess': {
        'emptyResolve': 'skip'
      },
      'ChartFilter': {
        'showFilter': false,
        'filteredSery': ''
      }
    },
    'SeriesSetting': { // 系列设置
      'SeriesSelect': { // 选择系列
        'label': '请选择系列',
        'selectValue': '', // 默认选择的系列名字 第一个元素
        'remarkShow': false, // 是否显示别名
        'remark': '', // 别名默认是选择的系列名字 第一个元素
        'seriesOption': [{ label: '价格', value: '价格-0' }, { label: '数量', value: '数量-0' }, { label: '温度', value: '温度-1' }] // 从数据中拿到系列的名字
      },
      'SeriesAxis': {
        'type': 'default'
      },
      'SeriesChartLabel': { // 某个系列显示图表标签
        'check': false, // 默认未选中
        'color': '' // 颜色
      },
      'SeriesMark': { // 标记点
        'show': false, // 副轴才是true
        'check': false, // 默认未选中
        'markType': 'circle'
      },
      'SeriesMaximum': { // 最值
        'check': false // 默认未选中
      },
      'SeriesLine': { // 线条样式
        'show': true, // 副轴才是true
        'lineType': 'solid' // 默认实线
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {}// 数据集
}
