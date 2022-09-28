<template>
  <div class="self-chart-content">
    <el-input
      v-model="textarea"
      type="textarea"
      :style="customizeStyle"
      resize="none"
      :rows="5"
      placeholder="请输入内容"
      @blur="changeContent"
    />
  </div>
</template>

<script>
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import { getLayoutById, formatDataValue, deepClone } from '@/utils/optionUtils'
export default {
  name: 'TextChart',
  mixins: [baseMixins],
  data () {
    return {
      // colorFromScript: 'red',
      // customizeStyle: {},
      textarea: '',
      type: 'TextChart'// 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
    }
  },
  computed: {
    layout() {
      return getLayoutById(this.identify)
    },
    height() {
      const titleSize = this.storeOption.theme ? (this.storeOption.theme.Basic.Title.size) || 14 : 14
      const data = (this.layout.height || 200) - 55 - (titleSize - 14)
      return data + 'px'
    },
    customizeStyle() {
      const style = this.storeOption.theme ? this.storeOption.theme.Basic.TextAreaStyle : {}
      const { show, color, size, background } = style
      let result = {}
      if (show) {
        result = {
          color,
          background,
          fontSize: size + 'px'
        }
      }
      return {
        height: this.height,
        ...result
      }
    }
  },
  mounted() {
    this.initContent()
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = formatDataValue(deepClone(this.chartData))
      const text = this.dataValue[1] && this.dataValue[1].slice(1).join('\n')
      this.textarea = text || ''
      this.storeOption.content = this.textarea
    },
    initContent() {
      this.textarea = this.storeOption.content
      this.customizeStyle1 = {
        height: this.height,
        color: 'red',
        background: 'gray',
        fontSize: '50px'
      }
    },
    changeContent() {
      this.storeOption.content = this.textarea
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner  {
  height: 100%;
  color: inherit;
  background: inherit;
}
</style>
