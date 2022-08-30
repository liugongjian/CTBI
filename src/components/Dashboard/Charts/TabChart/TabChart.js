/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-18 14:33:53
 * @Description:
 */

export default {
  'type': 'controller', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': 'Tab组件', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': 'Tab组件', // 标题名称
        'color': '#000', // 标题颜色
        'show': true // 是否显示标题
      },
      'Mark': { // 备注
        'show': false, // 是否显示备注
        'position': 'onChart', // 备注出现位置
        'text': ''// 备注信息
      },
      'CustomBackgroundEnable': { // 自定义背景填充
        'color': '', // 卡片颜色
        'show': false, // 是否使用自定义背景填充
        'showImg': false, // 是否使用背景图片
        'imgUrl': '', // 背景图片地址
        'imgSize': 'containRight' // 背景图片尺寸位置
      }
    },
    'TabConfig': {}
  },
  'advance': {} // 高级
}
