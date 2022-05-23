<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      图表类型
    </div>
    <div class="editor-item-container">
      <span
        v-for="(item, index) in typeOption"
        :key="index"
        class="svg-container"
        :class="{'active': option.type===item.value}"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.name"
          placement="top"
        >
          <svg-icon
            :icon-class="item.value"
            @click="changeHandler(item.value)"
          />
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getLayoutById } from '@/utils/optionUtils'
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
        [
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
        ],
        [
          {
            name: '柱图',
            value: 'BarChart'
          }, {
            name: '堆积柱状图',
            value: 'StackedBarChart'
          }, {
            name: '百分比堆积柱状图',
            value: 'PercentStackedBarChart'
          }
        ],
        [
          {
            name: '条形图',
            value: 'HorizontalBarChart'
          }, {
            name: '堆积条形图',
            value: 'StackedHorizontalBarChart'
          }, {
            name: '百分比堆积条形图',
            value: 'PSHorizontalBarChart'
          }
        ]
      ]
    }
  },
  computed: {
    // 根据type获取对应图表类型集合
    typeOption () {
      let typeOption = []
      this.typeOptions.forEach(item => {
        const isType = item.findIndex(ele => {
          return ele.value === this.option.type
        })
        if (isType !== -1) {
          typeOption = item
        }
      })
      return typeOption
    }
  },
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (type) {
      const storeOption = getLayoutById(store.state.app.currentLayoutId)
      const dataSource = JSON.parse(JSON.stringify(storeOption.option.dataSource))
      const dataSet = JSON.parse(JSON.stringify(storeOption.option.dataSet))
      storeOption.option = JSON.parse(JSON.stringify(store.state.app.toolList[type]))
      storeOption.option.dataSource = dataSource
      storeOption.option.dataSet = dataSet
      storeOption.is = type
    }
  }

}
</script>

<style lang="scss" scoped>
.svg-container {
  cursor: pointer;
  display: inline-block;
  height: 30px;
  width: 30px;
  margin-right: 8px;
  line-height: 32px;
  text-align: center;
}
.svg-container.active{
  border: 1px solid rgba(250,131,52,1);
}
</style>
