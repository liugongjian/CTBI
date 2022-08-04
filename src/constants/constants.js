export const DatasetType = {
  'Measure': '度量',
  'Dimension': '维度'
}

export const DataTypeOptions = [
  {
    value: 'number',
    label: '数字'
  },
  {
    value: 'granularity',
    label: '地理',
    children: [{
      value: 'area',
      parentValue: 'granularity',
      originValue: 'text',
      label: '区域'
    },
    {
      value: 'province',
      parentValue: 'granularity',
      originValue: 'text',
      label: '省/直辖市'
    },
    {
      value: 'city',
      parentValue: 'granularity',
      originValue: 'text',
      label: '市'
    },
    {
      value: 'country',
      parentValue: 'granularity',
      originValue: 'text',
      label: '区/县'
    },
    {
      value: 'longitude',
      parentValue: 'granularity',
      originValue: 'text',
      label: '经度'
    },
    {
      value: 'dimensionality',
      parentValue: 'granularity',
      originValue: 'text',
      label: '维度'
    }]
  },
  {
    value: 'text',
    label: '文本'
  },
  {
    value: 'time',
    label: '时间'
  }
]

export const FormatMap = {
  text: [],
  number: [
    {
      label: '整数',
      value: '#,##0'
    },
    {
      label: '保留1位小数',
      value: '#,##0.0'
    },
    {
      label: '保留2位小数',
      value: '#,##0.00'
    },
    {
      label: '百分比',
      value: '#,##0%'
    },
    {
      label: '百分比1位小数',
      value: '#,##0.0%'
    },
    {
      label: '百分比2位小数',
      value: '#,##0.00%'
    }
  ],
  time: [
    {
      label: '年-月-日 时-分秒',
      value: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}

export const AggFunctionOptions = [
  { label: '求和', value: 'sum' },
  { label: '计数', value: 'count' },
  { label: '技术(去重)', value: 'distinct-count' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
  { label: '平均数', value: 'min' }
]
