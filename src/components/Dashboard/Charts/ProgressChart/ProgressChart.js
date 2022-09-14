/*
 * @Author: 黄璐璐
 * @Date: 2022-08-22 09:15:11
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 15:20:20
 * @Description:
 */
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
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'indicator', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 5, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '进度条', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '进度条', // 标题名称
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
      'VisualStyle': { // 可视化样式 value与组件name绑定
        'style1': { 'name': '条形', value: 'barType' },
        'style2': { 'name': '环形', value: 'ring' },
        'style3': { 'name': '水波图', value: 'waterWave' },
        'style': 'barType' // 默认配置
      }
    },
    'ComponentOption': { // 图表样式
      'ProgressStyle': { // 样式设置
        'showNum': 1,
        'indicators': [
          { 'name': '名称', 'color': '#393f4d', 'fontSize': 16 },
          { 'name': '数值', 'color': '#393f4d', 'fontSize': 16 }
        ],
        'value': {
          'show': false,
          'current': '实际',
          'target': '目标',
          'style': { 'color': '#393f4d', 'fontSize': 16 }
        }
        // 'color': []
      },
      'Color': { // 颜色设置
        'title': '配色设置',
        'color': colorTheme['官方'],
        'theme': '官方'
      }
    },
    'FunctionalOption': { // 功能配置
      'ProgressConfig': {
        'cfgTarget': [], // 目标值
        'cfgTargetOption': [], // 目标值数据集
        'proportion': { type: 1, decimal: 0 }
      }
    }
  },
  'advance': {}, // 高级
  // 'dataSource': {}// 数据集
  'dataSource': {
    'Measure': { // 度量
      'name': '进度指示/度量',
      'require': true,
      'limit': 10,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '', // 数据集名称
    'limit': defaultDataLimit // 结果展示字段限制
  }
}
