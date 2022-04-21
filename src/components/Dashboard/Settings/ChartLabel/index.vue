<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.check"
        label="显示标签"
      />
      <el-checkbox-group
        v-if="labelOptions.length>0"
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
    <div v-if="option.type==='FunnelChart'" class="editor-object-container">
      <div>转换率计算方式</div>
      <el-radio
        v-model="option.funnelTransform"
        :label="1"
      >占上一层的百分比</el-radio>
      <el-radio
        v-model="option.funnelTransform"
        :label="2"
      >占第一层的百分比</el-radio>
    </div>
    <div
      v-if="option.precisionShow"
      class="editor-object-container"
    >
      <span>设置完成占比小数位数</span>
      <el-select
        v-model="option.precision"
        placeholder="请选择"
      >
        <el-option
          v-for="item in precisionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div
      v-if="option.labelShow"
      class="editor-object-container"
      style="display: flex;align-items: center"
    >
      <span>数据标签展示方式</span>
      <el-radio
        v-model="option.labelShow"
        :label="1"
      >智能显示</el-radio>
      <el-radio
        v-model="option.labelShow"
        :label="2"
      >全量显示</el-radio>
    </div>
  </div>
</template>

<script>
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
        'LineChart': []
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
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px;
}
</style>
