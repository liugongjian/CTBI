<template>
  <div class="editor-object-container">
    <div>
      展示样式
    </div>
    <div
      class="editor-item-container"
    >
      <div
        v-for="(item, index) in shapeOptions"
        :key="index"
        style="cursor: pointer"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div class="shape">
            <svg-icon
              :class="{pitch: item.value === option.shape}"
              class="shape-icon"
              :icon-class="item.value"
              style="font-size: 30px;"
              @click="changeHandler(item.value)"
            />
            <span>{{ item.name }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadarChartShape',
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
          name: '多边形',
          value: 'polygon'
        }, {
          name: '圆形',
          value: 'circle'
        }
      ]
    }
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
  .shape {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-right: 15px;
    .shape-icon {
      padding: 6px;
    }
    .shape-icon {
      border: 1px solid #FFF;
    }
    .shape-icon:hover {
      border-color: #616571;
    }
    .pitch {
      border-color:  #2e74ff !important;
    }
  }
}
</style>
