<template>
  <div class="editor-object-container">
    <div class="editor-item-title">连线样式</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.lineType">
        <el-radio :label="1">
          <svg-icon icon-class="curve" style="margin-right:5px" />曲线
        </el-radio>
        <el-radio :label="2">
          <svg-icon icon-class="straightLine" style="margin-right:5px" />直线
        </el-radio>
      </el-radio-group>
    </div>
    <div class="editor-object-container m-t-12">
      <div class="editor-item-title">连线配色</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.lineColor">
          <el-radio :label="1">
            固定配色
          </el-radio>
          <el-radio :label="2">
            跟随维度节点
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="editor-object-container">
      <div class="editor-item-title">连线透明度</div>
      <div class="editor-item-container flex-align-center">
        <el-slider v-model="option.lineOpacity" :format-tooltip="formatTooltip" />
        <input
          v-model="option.lineOpacity"
          type="number"
          class="limit-input"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SankeyLine',
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
  computed: {
  },
  mounted () {
  },
  methods: {
    formatTooltip(val) {
      return val + '%'
    }
  }

}
</script>

<style lang="scss" scoped>
.limit-input {
    box-sizing: border-box;
    background: rgba(0, 0, 0, .1);
    color: #fff;
    padding: 0 8px;
    width: 60px;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 2px;
    margin-left: 8px;
}
.el-slider{
    flex: 1;
}
</style>
