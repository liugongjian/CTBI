/**
{
  "author": "Tang xinwei",
  "time": "2022/04/14",
  "description": "漏斗图"
}
 * */
// 漏斗图配置项信息
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
  'type': 'relation', // 组件类型, 用于管理组件类型集合，例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'title': '漏斗图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '漏斗图', // 标题名称
        'color': '#333', // 标题颜色
        'show': true // 是否显示标题
      },
      'Mark': { // 备注
        'show': false, // 是否显示备注
        'position': 'onChart', // 备注出现位置
        'text': '' // 备注信息
      },
      'Footer': { // 尾注
        'show': false, // 是否显示尾注
        'text': '' // 尾注信息
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
        'style1': { 'name': '标准', value: 'funnel-standard' }, // 漏斗图 标准
        'style2': { 'name': '转化分析', value: 'funnel-horizontal' }, // 漏斗图 转化分析
        'style': 'funnel'
      }
    },
    'ComponentOption': { // 图表样式
      'DisplayStyle': {
        // 展示样式 标准图
        'default': true, // 默认样式
        'trapezoid': false, // 梯形
        'rectangle': false, // 矩形
        // 展示样式 转化分析图
        'horizontal': false, // 横向
        'vertical': false, // 纵向
        // 显示类别标签
        'labelPos': 'left',
        // 显示数据标签
        'dataLabel': 'conversion',
        // 转化率计算方式
        'calcMethod': 'last',
        // 底部样式
        'triangle': false
      },
      'Legend': { // 图例
        'show': true,
        'top': 'auto',
        'left': 'center',
        'orient': 'horizontal',
        'type': 'scroll'
      }
    },
    'LabelOption': {
      // 系列设置
      'aliasName': ''
    }
  },
  'advance': {}, // 高级
  'dataSource': {
    'Dimension': { // 维度
      'name': '漏斗分层/维度',
      'require': false,
      'limit': 1,
      'value': []
    },
    'Measure': { // 度量
      'name': '漏斗层宽/度量',
      'require': false,
      'limit': 20,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}
