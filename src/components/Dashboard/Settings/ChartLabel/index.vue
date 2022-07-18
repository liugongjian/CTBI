<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.check"
        label="显示图表标签"
        @change="handleSeriesLabel"
      />
      <div
        v-if="labelOptions.length>0"
        class="editor-item-container"
        :class="!option.check?'box-disabled':''"
      >
        <el-checkbox-group
          v-model="option.checkList"
          :disabled="!option.check"
        >
          <el-checkbox
            v-for="(item, index) in labelOptions"
            :key="index"
            :label="item.label"
          />
        </el-checkbox-group>
      </div>
    </div>
    <div
      v-if="option.type==='FunnelChart'"
      class="editor-object-container"
    >
      <div class="editor-item-title">转换率计算方式</div>
      <el-radio-group v-model="option.funnelTransform">
        <el-radio :label="1">占上一层的百分比</el-radio>
        <el-radio :label="2">占第一层的百分比</el-radio>
      </el-radio-group>
    </div>
    <div
      v-if="option.precisionShow"
      class="editor-object-container flex-align-center"
    >
      <div
        class="editor-item-title"
        style="width: 120px"
      >设置完成占比小数位数</div>
      <div style="flex: 1">
        <el-select
          v-model="option.precision"
          placeholder="请选择"
          popper-class="setting-select"
        >
          <el-option
            v-for="item in precisionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div
      v-if="option.labelShow"
      class="editor-object-container flex-align-center"
    >
      <div
        class="editor-item-title"
        style="width: 96px"
      >数据标签展示方式</div>
      <div style="flex: 1">
        <el-radio-group v-model="option.labelShow">
          <el-radio :label="1">智能显示</el-radio>
          <el-radio :label="2">全量显示</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'ChartLabel',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      // 图表标签格式类型集合
      options: {
        'PieChart': [
          {
            label: '维度'
          }, {
            label: '度量'
          }, {
            label: '百分比'
          }
        ],
        'BarChart': [],
        'StackedBarChart': [
          {
            label: '度量'
          }, {
            label: '总计'
          }
        ],
        'PercentStackedBarChart': [
          {
            label: '度量'
          }, {
            label: '百分比'
          }
        ],
        'CombineChart': [],
        'FunnelChart': [
          {
            label: '转化率'
          }, {
            label: '度量值'
          }, {
            label: '转化率+度量值'
          }
        ],
        'LineChart': [],
        'AreaChart': [],
        'StackedAreaChart': [
          {
            label: '度量'
          }, {
            label: '总计'
          }
        ],
        'PercentStackedAreaChart': [
          {
            label: '度量'
          }, {
            label: '百分比'
          }
        ],
        'HorizontalBarChart': [],
        'StackedHorizontalBarChart': [
          {
            label: '度量'
          }, {
            label: '总计'
          }
        ],
        'PSHorizontalBarChart': [
          {
            label: '度量'
          }, {
            label: '百分比'
          }
        ],
        'RectangleTreeChart': [
          {
            label: '度量'
          }, {
            label: '百分比'
          }
        ],
        'SankeyChart': [
          {
            label: '维度字段名+度量值'
          }, {
            label: '仅维度字段名'
          }
        ]
      },
      precisionOptions: [
        {
          value: 0,
          label: '0'
        }, {
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }
      ],
      checkList: []
    }
  },
  computed: {
    // 根据type获取对应图表标签集合
    labelOptions () {
      return this.options[this.option.type]
    }
  },
  mounted () {
  },
  methods: {
    // 联动改变 系列选择中的图表标签复选框值
    handleSeriesLabel (val) {
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          if (item.option.theme.SeriesSetting.SeriesSelect.SeriesChartLabel) {
            item.option.theme.SeriesSetting.SeriesSelect.seriesOption.map((item) => {
              item.showLabel = val
            })
            item.option.theme.SeriesSetting.SeriesSelect.SeriesChartLabel.check = val
          }
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
