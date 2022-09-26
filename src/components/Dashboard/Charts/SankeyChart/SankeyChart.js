/*
 * @Author: 黄璐璐
 * @Date: 2022-07-25 15:36:37
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-23 17:24:40
 * @Description:
 */
/*
* 桑基图
* */
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'relation', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 7, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '桑基图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': {
    'Basic': {
      'Title': { // 标题组件
        'text': '桑基图', // 标题名称
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
      'SankeyChartLabel': { // 标签样式
        'type': 'SankeyChart', // 饼图标签样式
        'check': true, // 选中显示标签
        'checkList': '维度字段名+度量值'
      },
      'SankeyLine': { // 线条样式
        'lineType': 1, // 连线样式
        'lineColor': 1, // 连线颜色
        'lineOpacity': 25 // 连线透明度
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': {
      'name': '节点类别/维度',
      'require': false,
      'tooltip': '可添加2到20个维度',
      'least': 2,
      'limit': 20,
      'value': []
    },
    'Measure': {
      'name': '节点高度/度量',
      'require': false,
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

