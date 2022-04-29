<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.isStack"
        label="堆积"
        @change="handleStack"
      />
    </div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.isPercent"
        label="百分比"
        @change="handlePercent"
      />
    </div>
  </div>

</template>

<script>
import store from '@/store'
export default {
  name: 'PercentStack',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleStack(val) {
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          if (item.option.theme.ComponentOption.ChartLabel) {
            item.option.theme.ComponentOption.ChartLabel.type = 'StackedBarChart'
            item.option.theme.ComponentOption.ChartLabel.checkList = ['度量']
          }
        }
      })
    },
    handlePercent(val) {
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          if (item.option.theme.ComponentOption.ChartLabel) {
            item.option.theme.ComponentOption.ChartLabel.type = 'PercentStackedBarChart'
            item.option.theme.ComponentOption.ChartLabel.checkList = ['百分比']
          }
        }
      })
    }
  }

}
</script>

<style>
</style>
