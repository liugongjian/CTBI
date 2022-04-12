<template>
  <div class="editor-object-container">
    <div>
      可视化样式
    </div>
    <div
      class="editor-item-container"
    >
      <span
        v-for="(item, index) in styleOptions"
        :key="index"
        style="cursor: pointer"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <svg-icon
            :icon-class="item.value"
            style="font-size: 30px;"
            @click="changeHandler(item.value)"
          />
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisualStyle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      styleOptions: []
    }
  },
  watch: {},
  created () { },
  mounted () {
    for (var item in this.option) {
      if (typeof (this.option[item]) === 'object') {
        this.styleOptions.push(this.option[item])
      }
    }
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (val) {
      this.option.style = val
    }
  }

}
</script>

<style>
</style>
