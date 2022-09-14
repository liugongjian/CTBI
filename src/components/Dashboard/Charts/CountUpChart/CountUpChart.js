/*
 * @Author: 黄璐璐
 * @Date: 2022-07-29 10:27:13
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-14 22:22:18
 * @Description:
 */
import { defaultDataLimit } from '@/constants/constants'
export default {
  'type': 'indicator', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 3,
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '翻牌器', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': {
    // 样式组件、配置合集
    'Basic': {
      // 基础属性
      'Title': {
        // 标题组件
        'text': '翻牌器', // 标题名称
        'color': '#333', // 标题颜色
        'size': 14, // 标题大小
        'show': true // 是否显示标题
      },
      'Mark': {
        // 备注
        'show': false, // 是否显示备注
        'position': 'onChart', // 备注出现位置
        'text': '' // 备注信息
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
    'StyleConfig': {
      'FontStyle': { // 字体样式
        'show': true, // 是否显示字体样式组件
        'checked': false, // 默认选中
        'label': '设置字体样式', // 复选框的label
        'data': [
          { 'name': '名称', 'color': '#393f4d', 'fontSize': 12 },
          { 'name': '数值', 'color': '#393f4d', 'fontSize': 24 }
        ],
        'mainIndicatorShow': false // 主指标的字体设置
      },
      'IndicatorPosition': { // 指标块内位置
        'title': '指标块内位置',
        'position': 'center', // center left 位置
        'align': 'left' // center left 对齐方式
      },
      'IndicatorPic': { // 主指标修饰图
        'check': false,
        'label': '显示指标修饰图',
        'Color': { // 颜色设置
          'title': '配色设置',
          'color': [],
          'theme': '官方'
        },
        'pic': false, // 是否有图片的设置
        'type': 'static', // img static
        'setSvg': []
      }
    },
    'SeriesSetting': {
      'IndicatorSeries': { // 指标里面的系列选择组件
        'dataSeries': [],
        'series': '' // 所选系列
      }
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Measure': { // 度量
      'name': '展示指标/度量',
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
