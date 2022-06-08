<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
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
          <div class="box">
            <svg-icon
              class="shape-icon"
              :class="{pitch: item.value === option.style}"
              :icon-class="item.value"
              style="font-size: 30px;"
              @click="changeHandler(item.value)"
            />
            <span>{{ item.name }}</span>
          </div>

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

<style lang="scss" scoped>
.editor-item-container {
  display: flex;
}
.box {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: 5px;
  .shape-icon {
    padding: 6px;
    margin-right: 5px;
    border: 1px solid transparent;
  }
  .shape-icon:hover {
    border: 1px solid #616571;
  }
  .pitch {
    border: 1px solid  #fa8334 !important;
  }
}
</style>
