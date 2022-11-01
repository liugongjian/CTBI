/*
 * @Author: 黄璐璐
 * @Date: 2022-08-22 09:15:11
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-23 17:19:57
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
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'indicator', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 4, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '仪表盘', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '仪表盘', // 标题名称
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
      'VisualStyle': { // 可视化样式
        'style1': { 'name': '标准', value: 'standard' },
        'style2': { 'name': '扇形', value: 'fan' },
        'style3': { 'name': '刻度', value: 'calibration' },
        'style': 'standard' // 默认配置
      }
    },
    'ComponentOption': { // 图表样式
      'ConfigSize': { // 设置起点值 终点值
        'startType': 'fixed',
        'endType': 'fixed',
        'start': 0,
        'end': 100,
        'measureOptions': [], // 动态值选项
        'dynamicStart': {
          'field': '', 'type': 'sum'
        },
        'dynamicEnd': {
          'field': '', 'type': 'sum'
        }
      }
    },
    'StyleConfig': { // 样式配置
      'Label': {
        'format': true, // true指针式 false 百分比
        'decimal': 0,
        'name': { 'color': '#333', fontSize: 13 },
        'value': { 'color': '#333', fontSize: 16 },
        'deputy': { 'show': true, 'color': '#333', fontSize: 16, decimal: 0 }
      },
      'Scale': { // 显示刻度控制
        'show': true,
        'type': 'original' // original percentage
      },
      'Section': { // 区间设置 // 2022/04/18暂时先不做
        'show': true,
        'type': 'original' // original percentage
      },
      'DashboardColor': {
        'color': '',
        'title': '区块颜色配置'
      }
    }
  },
  'advance': {}, // 高级
  // 'dataSource': {}// 数据集
  'dataSource': {
    'Measure': { // 度量
      'name': '指针角度/度量',
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
