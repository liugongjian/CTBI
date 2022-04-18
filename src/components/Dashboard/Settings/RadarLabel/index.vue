<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-model="checked" @change="changeChecked">显示图表标签</el-checkbox>
    </div>
    <div
      class="editor-item-container"
    >
      <el-radio-group v-model="radioLabel" class="label" :disabled="!checked" @change="changeRadioLabel">
        <el-radio :label="1">智能显示</el-radio>
        <el-radio :label="2">全量显示</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadarLabel',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      checked: false,
      radioLabel: ''
    }
  },
  methods: {
    changeChecked (val) {
      if (!val) {
        this.option.labelShow = 0
      } else {
        this.option.labelShow = this.radioLabel || 0
      }
    },
    changeRadioLabel (val) {
      this.option.labelShow = val
    }
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px ;
}
</style>
