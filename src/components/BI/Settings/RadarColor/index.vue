<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-model="checked" @change="changeChecked">节点之间面积填充</el-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RadarColor',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    changeChecked (val) {
      this.option.areaStyle = val
    }
  }
}
</script>
