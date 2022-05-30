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
  type: 'indicator', // 组件类型, 用于管理组件类型集合, 例如：指标、表格、趋势
  isShow: false, // 是否展示该组件, 用于控制该组件是否在tools中显示
  version: '', // 版本号
  field: {}, // 字段
  theme: {
    // 样式组件、配置合集
    Basic: {
      // 基础属性
      Title: {
        // 标题组件
        text: '看板_分区域', // 标题名称
        color: '#333', // 标题颜色
        show: true, // 是否显示标题
        testShow: false // 测试显示
      },
      Mark: {
        // 备注
        show: false, // 是否显示备注
        position: 'onChart', // 备注出现位置
        text: '' // 备注信息
      },
      Footer: {
        // 尾注
        show: false, // 是否显示尾注
        text: '' // 尾注信息
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
    ComponentOption: {
      // 图表样式
      Legend: {
        // 图例
        show: true,
        top: 'auto',
        left: 'center',
        orient: 'horizontal',
        type: 'scroll'
      }
    },
    StyleConfig: {
      IndexQuickly: { // 指标快样式配置
        relation: 'parataxis', // parataxis deputy
        moreRelation: 'lineBreak', // line lineBreak
        lineNum: 2,
        dimension: true,
        indicators: true,
        fontStyle: {
          show: true,
          data: [
            { name: '维度名称', color: '#393f4d', fontSize: 16, show: true },
            { name: '主指标名称', color: '#393f4d', fontSize: 16, show: false },
            { name: '主指标数值', color: '#393f4d', fontSize: 16, show: false }
          ],
          target: { valColor: '#393f4d', nameColor: '#393f4d', fontSize: 16 }
        },
        position: 'center', // center left 位置
        align: 'center', // center left 对齐方式
        modified: true,
        color: colorTheme['defaultColor'],
        type: 'static', // img static
        setSvg: []
      }
    },
    SeriesSetting: {
      kanBanSeries: {
        dataSeries: [],
        series: '' // 所选系列
      }
    }
  },
  advance: {}, // 高级
  dataSource: {} // 数据集
}
