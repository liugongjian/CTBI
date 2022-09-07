/*
 * @Author: 黄璐璐
 * @Date: 2022-06-08 10:54:25
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-18 21:49:09
 * @Description:
 */
// 仪表盘配置项信息
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
  'type': 'distribution', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 5, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '词云图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '词云图', // 标题名称
        'color': '#333', // 标题颜色
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
      }
    },
    'ComponentOption': { // 图表样式
      'WordCloudShape': { // 词云形状
        'shape': 'rectangle' // 矩形  椭圆 三角形 爱心
      },
      'TextDirection': { // 词云形状
        'vertical': false // 矩形  椭圆 三角形 爱心
      },
      'WordCloudTextSize': { // 词大小范围
        'maxValue': 0, // 默认0
        'minValue': 0, // 默认0
        'isMaxValue': true, // 默认选中取度量最大值
        'isMinValue': false // 默认未选中取度量最小值
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '词标签/维度',
      'require': true,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': '词大小/度量',
      'require': false,
      'tooltip': '无度量时维度出现频次决定词大小',
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

