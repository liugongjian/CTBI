
// 在指标看板第一级显示的图标
const brief = [
  'KanBanSummary',
  'TableChart',
  'LineChart',
  'StackedBarChart',
  'PieChart',
  'FunnelChart',
  'ColorMapChart'
]

/**
 * 获取所有配置项的js文件
 * js文件名应该与组件一致
 */
export function getToolList () {
  const componentsContext = require.context('@/components/Dashboard/Charts/', true, /.js$/)
  const dataJson = {}
  const path = require('path')
  componentsContext.keys().forEach(item => {
    const itemName = path.basename(item, '.js')
    const componentConfig = componentsContext(item).default
    // 过滤无需展示的组件
    if (componentConfig.isShow) {
      dataJson[itemName] = componentConfig
    }
    return
  })
  return dataJson
}

/**
 * 获取所有配置项的js文件
 * js文件名应该与组件一致
 */
export function getBriefToolList () {
  const tools = getToolList()
  const briefTools = {}
  brief.forEach(item => {
    briefTools[item] = tools[item]
  })
  return briefTools
}

export const chartCategory = [
  { category: 'indicator', name: '指标' },
  { category: 'table', name: '表格' },
  { category: 'trend', name: '趋势' },
  { category: 'comparator', name: '比较' },
  { category: 'distribution', name: '分布' },
  { category: 'relation', name: '关系' },
  { category: 'space', name: '空间' }
]
