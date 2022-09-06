<!--
 * @Author: 黄璐璐
 * @Date: 2022-09-02 16:09:28
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-02 16:15:56
 * @Description:
-->
<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.check"
        label="显示数据标签"
      />
      <div
        v-if="labelOptions.length>0"
        class="editor-item-container"
        :class="!option.check?'box-disabled':''"
      >
        <el-radio-group
          v-model="option.checkList"
          :disabled="!option.check"
        >
          <el-radio
            v-for="(item, index) in labelOptions"
            :key="index"
            :label="item.label"
          />
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SankeyChartLabel',
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
        'SankeyChart': [
          {
            label: '维度字段名+度量值'
          }, {
            label: '仅维度字段名'
          }
        ]
      },
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
</style>
