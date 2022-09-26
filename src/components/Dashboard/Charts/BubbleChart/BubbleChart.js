/*
* 气泡图
* */
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 3, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '气泡图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '气泡图', // 标题名称
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
      }
    },
    'ComponentOption': {
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      },
      'Slider': { // 数据点大小
        'symbolSize': 5, // 默认大小
        'minSize': 1, // 最小值
        'maxSize': 40 // 最大值
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
        'auto': true, // 最大值、最小值的设置是否显示
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
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': 'X轴/维度或度量',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': 'Y轴/度量',
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
