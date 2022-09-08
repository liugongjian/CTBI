<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-07 10:44:39
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      词大小范围
    </div>
    <div
      class="editor-item-container"
    >
      <div class="m-r-2">最大值</div>
      <div style="display: flex; align-items: center" class="m-t-12">
        <div class="m-r-8">
          <input
            v-model="option.maxValue"
            type="number"
            :disabled="option.isMaxValue"
            class="number-input"
            :class="option.isMaxValue ? 'box-disabled' : ''"
          >
        </div>
        <el-checkbox
          v-model="option.isMaxValue"
          label="取度量最多"
        />
      </div>
      <div class="m-t-12">最小值</div>
      <div style="display: flex;align-items: center;" class="m-t-12">
        <div class="m-r-8">
          <input
            v-model="option.minValue"
            type="number"
            :disabled="option.isMinValue"
            class="number-input"
            :class="option.isMinValue ? 'box-disabled' : ''"
          >
        </div>
        <el-checkbox
          v-model="option.isMinValue"
          label="取度量最少"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordCloudTextSize',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      shapeOptions: [
        {
          name: '矩形',
          value: 'rectangle'
        }, {
          name: '椭圆',
          value: 'oval'
        }, {
          name: '三角形',
          value: 'triangle'
        }, {
          name: '爱心',
          value: 'cardioid'
        }
      ]
    }
  },
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.number-input{
  box-sizing: border-box;
  background: rgba(0, 0, 0, .1);
  color: #fff;
  padding: 0 8px;
  width: 100px;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 2px;
}
</style>
