<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.show"
        label="显示图表标签"
      />
      <div class="editor-item-container">
        <el-checkbox-group
          v-show="option.showCheckBox"
          v-model="option.checkList"
          :disabled="!option.show"
        >
          <el-checkbox
            v-for="(item, index) in labelOptions"
            :key="index"
            :label="item.label"
          />
        </el-checkbox-group>
      </div>
    </div>
    <div class="editor-object-container">
      <div>数据标签展示方式</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.labelShow">
          <el-radio label="auto">智能显示</el-radio>
          <el-radio label="all">全量显示</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'BarLabel',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      // 图表标签格式类型集合
      checkListOptions: {
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
        ]
      }
    }
  },
  computed: {
    // 根据Type返回对应的标签格式集合
    labelOptions () {
      return this.checkListOptions[this.option.type]
    }
  }
}
</script>

<style>
</style>
