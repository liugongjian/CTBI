// 看板-分区域总配置项信息
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
export default {
  'type': 'indicator', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1,
  'version': '', // 版本号
  'field': {}, // 字段
  'theme': {
    // 样式组件、配置合集
    'Basic': {
      // 基础属性
      'Title': {
        // 标题组件
        'text': '指标看板', // 标题名称
        'color': '#333', // 标题颜色
        'show': true, // 是否显示标题
        'testShow': false // 测试显示
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
      'IndicatorDisplay': { // 指标展示形式
        'relation': 'deputy', // parataxis 并列 deputy 主副
        'moreRelation': 'lineBreak', // line 左右滑动 lineBreak 换行平铺
        'lineNum': 4, // 每行最多个数
        'dimension': true, // 默认选中 维度复选框
        'indicators': true // 默认选中 (主)指标名称 复选框
      },
      'FontStyle': { // 字体样式
        'show': true, // 是否显示字体样式组件
        'check': true, // 默认选中
        'label': '设置字体样式', // 复选框的label
        'data': [
          { 'name': '维度', 'color': '#393f4d', 'fontSize': 16 }
        ],
        'target': { 'valColor': '#393f4d', 'nameColor': '#393f4d', 'valFontSize': 24, 'nameFontSize': 12 }, // 主指标名称和数值的字体设置
        'secTarget': { 'valColor': '#393f4d', 'nameColor': '#393f4d', 'fontSize': 12 } // 副指标名称和数值的字体设置
      },
      'IndicatorPosition': { // 指标块内位置
        'title': '主/副指标组合指标块内位置',
        'position': 'center', // center left 位置
        'align': 'left' // center left 对齐方式
      },
      'IndicatorPic': { // 主指标修饰图
        'check': false,
        'Color': { // 颜色设置
          'title': '配色设置',
          'color': colorTheme['官方'],
          'theme': '官方'
        },
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
    'Dimension': { // 维度
      'name': '看板标签/维度',
      'require': false,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': '看板指标/度量',
      'require': true,
      'limit': 20,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}
