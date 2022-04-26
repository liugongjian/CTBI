// YAxis 标签显示格式化
import baseMixins from './baseMixins'
import { addChineseUnit, addEnglishUnit } from '@/utils/numberUtils'
export default {
  mixins: [baseMixins],
  data () {
    return {}
  },
  methods: {
    formatYLabel (value, YAxisSet) {
      const { formatType, lang, numberFormat, numberDigit, kSeperator } = YAxisSet
      const isEnglish = lang === 'english'
      if (formatType === '1') { // 自动适配
        return isEnglish ? addEnglishUnit(value, 0) : addChineseUnit(value, lang === 'chinese-simplified', 0)
      } else if (formatType === '2') { // 自定义适配
        if (numberFormat === 'number') { // 数值
          return kSeperator ? value.toLocaleString('en-IN', { minimumFractionDigits: numberDigit }) : value.toFixed(numberDigit)
        } else if (numberFormat === 'percent') { // 百分比
          return (value * 100).toFixed(numberDigit) + '%'
        }
        return value
      } else if (formatType === '3') { // 手动输入，TODO 功能未完成
        return value
      }
    }
  }
}