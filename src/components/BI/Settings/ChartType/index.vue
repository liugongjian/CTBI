<template>
  <div class="editor-object-container">
    <div>
      图表类型
    </div>
    <div
      class="editor-item-container"
    >
      <span
        v-for="(item, index) in typeOptions"
        :key="index"
        style="cursor: pointer"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <svg-icon
            :icon-class="item.value"
            style="font-size: 30px;"
            @click="changeHandler(item.value)"
          />
        </el-tooltip>
      </span>
      <!-- <el-button
        type="text"
        @click="changeHandler('1')"
      >线图</el-button>
      <el-button
        type="text"
        @click="changeHandler('2')"
      >面积图</el-button>
      <el-button
        type="text"
        @click="changeHandler('3')"
      >堆积面积图</el-button>
      <el-button
        type="text"
        @click="changeHandler('4')"
      >百分比堆叠面积图</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartType',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      typeOptions: [
        {
          name: '线图',
          value: 'LineChart'
        }, {
          name: '面积图',
          value: 'AreaChart'
        }, {
          name: '堆叠面积图',
          value: 'StackedAreaChart'
        }, {
          name: '百分比堆叠面积图',
          value: 'PercentStackedAreaChart'
        }
      ]
    }
  },
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (type) {
      this.option.type = type
    }
  }

}
</script>

<style>
</style>
