/*
 * @Author: sihaiyang
 * @Date: 2022-09-28 10:34:49
 * @Last Modified by: sihaiyang
 * @Last Modified time: 2022-09-28 15:40:05
 */

/**
 * */
// 文本配置项信息

// import { colorTheme } from '@/constants/color.js'
import { defaultDataLimit } from '@/constants/constants'

export default {
  'type': 'controller', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '文本', // 图标的名字 不会改变 用于顶部的图标切换
  'content': '', // 文本内容
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '文本', // 标题名称
        'color': '#000', // 标题颜色
        'size': 14, // 标题大小
        'show': true // 是否显示标题
      },
      'Mark': { // 备注
        'show': false, // 是否显示备注
        'position': 'afterTitle', // 备注出现位置
        'text': ''// 备注信息
      },
      'CustomBackgroundEnable': { // 自定义背景填充
        'color': '', // 卡片颜色
        'show': false, // 是否使用自定义背景填充
        'showImg': false, // 是否使用背景图片
        'imgUrl': '', // 背景图片地址
        'imgSize': 'containRight' // 背景图片尺寸位置
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Measure': { // 度量
      'name': '值轴/度量',
      'require': true,
      'value': [],
      'limit': 5
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '', // 数据集名称
    'limit': defaultDataLimit // 结果展示字段限制
  }
}
