/*
 * @Author: qinruibin
 * @Date: 2022-08-04 14:13:56
 * @LastEditors: qinruibin
 * @LastEditTime: 2022-08-12 16:57:59
 * @Description:
 */
/**
{
  "author": "qinruibin",
  "time": "2022/08/04",
  "description": "环形柱图组件"
}
 * */
// 环形柱图配置项信息
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
  'type': 'comparator', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 7, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '环形柱状图', // 标题名称
        'color': '#000', // 标题颜色
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
    'ComponentOption': { // 图表样式
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '类别轴/维度',
      'require': true,
      'limit': 1,
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
    'name': '' // 数据集名称
  }
}
