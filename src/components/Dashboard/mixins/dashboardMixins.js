// 仪表盘的混入
import baseMixins from './baseMixins'
import { getDataValueById, formatDataValue } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(this.dataValue) !== '{}') {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
        }
        // this.getOption()
      },
      deep: true
    },
    dataOption: {
      handler(val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    }
  },
  methods: {
    formatData(data) {
      const obj = { value: 0 }
      for (let index = 0; index < data.length; index++) {
        if (index === 0) {
          obj.name = data[index][0]
        } else {
          obj.value += data[index][0]
        }
      }
      return obj
    }
  }
}
