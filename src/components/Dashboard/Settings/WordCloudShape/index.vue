<template>
  <div class="editor-object-container">
    <div>
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

<style>
</style>
