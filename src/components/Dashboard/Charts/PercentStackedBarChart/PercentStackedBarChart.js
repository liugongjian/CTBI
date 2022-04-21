/**
{
  "author": "ZhengJiale",
  "time": "2022/04/13",
  "description": "百分比堆积柱状图组件"
}
 * */
// 百分比堆积柱状图配置项信息
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
  'type': 'comparator', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '百分比堆积柱状图', // 标题名称
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
      'CustomBackgroundEnable': { // 自定义背景填充
        'color': '', // 卡片颜色
        'show': false, // 是否使用自定义背景填充
        'showImg': false, // 是否使用背景图片
        'imgUrl': '', // 背景图片地址
        'imgSize': 'containRight' // 背景图片尺寸位置
      },
      'ChartType': { // 图表类型
        'type': 'PercentStackedBarChart' // 1.柱图;2.堆积柱状图;3.百分比堆叠柱状图
      }
    },
    'ComponentOption': { // 图表样式
      'ChartLabel': { // 图表标签
        'check': false, // 是否展示图表标签
        'checkList': ['百分比'], // 标签格式 1. 度量；2. 百分比；3. 总计
        'type': 'PercentStackedBarChart', // 图表类型
        'labelShow': 1 // 数据标签展示方式 1 智能显示；2 全量显示
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'Color': { // 颜色设置
        'title': '配色设置',
        'color': colorTheme['defaultColor']
      },
      'TwisYAxis': { // 双Y轴
        'show': false, // 是否显示双Y轴
        'twisType': 'syncTicksNum' // 双Y轴类型 1.syncNull 不同步；2.syncTicksNum 刻度数量一致；3.syncAll 刻度数量&数值一致
      },
      'PercentStack': { // 百分比与堆积类型选择
        'isPercent': true, // 是否为百分比类型
        'isStack': true// 是否为堆积类型
      }
    },
    'SeriesSetting': { // 系列设置
      'SeriesSelect': { // 选择系列
        'label': '请选择系列',
        'selectValue': '', // 默认选择的系列名字 第一个元素
        'seriesOption': [] // 从数据中拿到系列的名字
      },
      'SeriesChartLabel': { // 某个系列显示图表标签
        'check': false, // 默认未选中
        'color': '' // 颜色
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {}// 数据集
}
