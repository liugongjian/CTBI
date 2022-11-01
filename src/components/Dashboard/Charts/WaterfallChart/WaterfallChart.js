// 瀑布图配置项信息
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
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'comparator', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 9, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '瀑布图',
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '瀑布图', // 标题名称
        'color': '#000', // 标题颜色
        'size': 14, // 标题大小
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
      },
      'CustomBackgroundEnable': { // 自定义背景填充
        'color': '', // 卡片颜色
        'show': false, // 是否使用自定义背景填充
        'showImg': false, // 是否使用背景图片
        'imgUrl': '', // 背景图片地址
        'imgSize': 'containRight' // 背景图片尺寸位置
      }
    },
    'NumberSetting': { // 数值设置
      'StartOrCumulative': { // 起始值和累积值的设置
        'startValueCheck': true, // 显示起始值的复选框值
        'startValueRemark': '起始值', // 起始值别名
        'startValue': 0, // 起始值
        'cumulativeValueCheck': true, // 显示累计值的复选框值
        'cumulativeValueRemark': '累计值', // 累计值别名
        'tipsCheck': false // 显示起始值/累计值Tips的复选框值
      }
    },
    'ComponentOption': { // 图表样式
      'ChartLabel': { // 图表标签
        'check': false, // 是否展示图表标签
        'checkList': ['度量'], // 标签格式 1. 度量；2. 百分比；3. 总计
        'type': 'BarChart', // 图表类型
        'labelShow': 1 // 数据标签展示方式 1 智能显示；2 全量显示
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'BarColor': { // 柱体配色
        'startValueColor': '#1A7DFF', // 起始值的颜色
        'cumulativeValueColor': '#ff751a', // 累计值的颜色
        'increaseValueColor': '#D0021B', // 增加的颜色
        'decreaseValueColor': '#89c369' // 减少的颜色
      }
    },
    'Axis': { // 坐标轴配置
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
        'auto': false, // 最大值、最小值的设置是否显示
        'min': 0,
        'max': 0,
        'autoMin': true,
        'autoMax': true,
        'autoEnlarge': false,
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
        'showDataZoom': 'auto'
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '类别轴/维度',
      'require': true,
      'value': []
    },
    'Measure': { // 度量
      'name': '值轴/度量',
      'require': true,
      'limit': 1,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '', // 数据集名称
    'limit': defaultDataLimit // 结果展示字段限制
  }
}
