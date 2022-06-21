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
  watch: {
    'option': {
      handler(val) {
        this.init()
      },
      deep: true
    }
  },
  created () { },
  mounted () {
    this.init()
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (val) {
      this.option.style = val
      this.option.VisualStyle = val // 漏斗图切换视图转化
      this.$store.state.funnel.visiableStyle = val // 控制功能面板的功能显示隐藏，禁用启用
    },
    // 初始化渲染和切换组件时随组件变化更新
    init() {
      this.styleOptions = []
      for (var item in this.option) {
        if (typeof (this.option[item]) === 'object') {
          this.styleOptions.push(this.option[item])
        }
      }
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
