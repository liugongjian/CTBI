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
        console.log('自定义适配', numberFormat, numberDigit, kSeperator)
      } else if (formatType === '3') { // 手动输入
        console.log('手动输入')
      }
    }
  }
}
