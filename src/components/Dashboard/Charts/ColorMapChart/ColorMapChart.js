/**
{
  "author": "ZhengJiale",
  "time": "2022/04/18",
  "description": "色彩地图组件"
}
 * */
// 饼图配置项信息
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
  'type': 'space', // 组件类型, 用于管理组件类型集合,例如：指标、表格、趋势
  'isShow': true, // 是否展示该组件, 用于控制该组件是否在tools中显示
  'order': 1, // 在tools中排序
  'version': '', // 版本号
  'field': {}, // 字段
  'name': '色彩地图', // 图标的名字 不会改变 用于顶部的图标切换
  'theme': { // 样式组件、配置合集
    'Basic': { // 基础属性
      'Title': { // 标题组件
        'text': '色彩地图', // 标题名称
        'color': '#333', // 标题颜色
        'show': true, // 是否显示标题
        'testShow': false // 测试显示
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
      MapStyleTemplates: { // 样式模板
        type: 'defaultMap'// 模板类型 1.defaultMap 默认；2.simpleMap 极简底图； 3.3DMap 3D填充
      }
    },
    'ComponentOption': { // 图表样式
      'ChartLabel': { // 图表标签
        'check': false, // 是否展示图表标签
        'checkList': ['维度'], // 标签格式 1. 维度；2. 度量；
        'type': 'BarChart', // 图表类型
        'labelShow': 1 // 数据标签展示方式 1 智能显示；2 全量显示
      },
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
      'name': '地理区域/维度',
      // 是否必选
      'require': true,
      // 数量限制正整数，如果为null则不做限制
      'limit': 1,
      // 自定义字段规则校验
      // 返回{success: true, msg: ''}
      'validate': function (field) {
        // const { attributes } = field
        // 验证二级字段类型是不是[地理]
        // if (attributes && attributes.length > 0) {
        //   const attr = attributes[0]
        //   const { secondeDataType } = attr
        //   if (secondeDataType && secondeDataType === 'granularity') {
        //     return { success: true, msg: '' }
        //   }
        // }
        // return { success: false, msg: '不支持添加该类型字段到[地理区域/维度]，需要[地理]类型的字段' }
        return { success: true, msg: '' }
      },
      'value': []
    },
    'Measure': { // 度量
      'name': '色彩饱和度/度量',
      // 是否必选
      'require': true,
      // 数量限制正整数，如果为null则不做限制
      'limit': 5,
      'value': []
    }
  }, // 数据集
  'dataSet': { // 当前正在使用的数据集
    'id': '', // 数据集ID
    'name': '' // 数据集名称
  }
}
