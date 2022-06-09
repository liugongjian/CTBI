<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      词云形状
    </div>
    <div
      class="editor-item-container"
    >
      <span
        v-for="(item, index) in shapeOptions"
        :key="index"
        style="cursor: pointer"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <svg-icon
            class="shape-icon"
            :class="{pitch: item.value === option.shape}"
            :icon-class="item.value"
            style="font-size: 16px;"
            @click="changeHandler(item.value)"
          />
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordCloudShape',
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
    // 图标点击添加组件到画布
    changeHandler (val) {
      this.option.shape = val
    }
  }

}
</script>

<style lang="scss" scoped>
.editor-item-container {
  display: flex;
  flex-direction: row;
  text-align: center;
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
