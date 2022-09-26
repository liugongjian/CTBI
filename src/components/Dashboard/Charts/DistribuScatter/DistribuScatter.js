/*
* 分布散点图
* */
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 5,
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '分面散点图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '分面散点图', // 标题名称
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
      'Color': { // 颜色设置
        'title': '数据设置',
        'color': [],
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
  }, // 数据集
  'dataSet': {
    'id': '',
    'name': '', // 数据集名称
    'limit': defaultDataLimit // 结果展示字段限制
  }
}
