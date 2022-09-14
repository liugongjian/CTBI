/**
{
  "author": "ZhengJiale",
  "time": "2022/04/30",
  "description": "条形图组件"
}
 * */
// 条形图配置项信息
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
  'order': 4, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '条形图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '条形图', // 标题名称
        'color': '#333', // 标题颜色
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
      },
      'ChartType': { // 图表类型
        'type': 'HorizontalBarChart' // 1.条形图;2.堆积条形图;3.百分比堆叠条形图
      }
    },
    'ComponentOption': { // 图表样式
      'ChartLabel': { // 图表标签
        'check': false, // 是否展示图表标签
        'checkList': ['度量'], // 标签格式 1. 度量；2. 百分比；3. 总计
        'type': 'HorizontalBarChart', // 图表类型
        'labelShow': 1 // 数据标签展示方式 1 智能显示；2 全量显示
      },
      'ChartAlign': { // 图表对齐方式
        'align': 'left'// 1.left 左对齐;2.right 右对齐
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
        'color': [],
        'theme': '官方'
      },
      // 'TwisYAxis': { // 双Y轴
      //   'show': true, // 是否必须显示双y轴的复选框
      //   'check': false, // 是否显示双Y轴
      //   'twisType': 'syncTicksNum' // 双Y轴类型 1.syncNull 不同步；2.syncTicksNum 刻度数量一致；3.syncAll 刻度数量&数值一致
      // },
      'PercentStack': { // 百分比与堆积类型选择
        'isPercent': false, // 是否为百分比类型
        'isStack': false// 是否为堆积类型
      }
    },
    'FunctionalOption': { // 功能配置
      'DataZoom': { // 缩略轴
        'showDataZoom': 'auto' // 显示方式：1.auto 智能适配；2.show 显示；3.hide 不显示
      },
      'LabelShowType': { // 坐标轴维度显示
        'axisShowType': 'auto' // 1.auto 智能显示；2.sparse 强制稀疏；3.condense 最多显示
      },
      'ChartFilter': { // 指标筛选指示
        'showFilter': false,
        'isMultiple': true, // 是否多选
        'selectedIndicator': [], // 选中的指标
        'indicatorOption': [] // 指标集合
      }
    },
    'Axis': { // 坐标轴配置
      'XAxis': {
        'cname': 'Y轴',
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
        'cname': '下X轴',
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
        'autoEnlarge': false,
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
        'seriesOption': [], // 从数据中拿到系列的名字
        'SeriesChartLabel': { // 某个系列显示图表标签
          'check': false, // 默认未选中
          'color': '' // 颜色
        },
        'SeriesMaximum': { // 最值
          'check': false // 默认未选中
        }
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
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '', // 数据集名称
    'limit': defaultDataLimit // 结果展示字段限制
  }
}

