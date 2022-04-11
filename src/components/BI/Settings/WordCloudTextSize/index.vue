<template>
  <div class="editor-object-container">
    <div>
      词大小范围
    </div>
    <div
      class="editor-item-container"
    >
      <div style="display: flex; align-items: center">
        <el-input-number
          v-model="option.maxValue"
          controls-position="right"
          :disabled="option.isMaxValue"
          style="width: 100px"
        />
        <el-checkbox
          v-model="option.isMaxValue"
          label="取度量最大值"
        />
      </div>
      <div style="display: flex;align-items: center">
        <el-input-number
          v-model="option.minValue"
          controls-position="right"
          style="width: 100px"
        />
        <el-checkbox
          v-model="option.isMinValue"
          label="取度量最小值"
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

<style>
</style>
