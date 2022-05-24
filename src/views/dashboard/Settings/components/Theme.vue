<template>
  <div class="editor-object-container">
    <div style="color:white;">
      展示样式
    </div>
    <div
      class="editor-item-container"
    >
      <div
        v-for="(item, index) in themes"
        :key="index"
        style="cursor: pointer"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div class="shape">
            <div class="shape_icon" :style="`background:${item.color};`" />
            <span>{{ item.name }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Theme',
  data () {
    return {
      themes: [
        {
          name: '浅色',
          color: '#fff'
        }, {
          name: '深色',
          color: '#2C3040'
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
    .shape_icon {
        width: 49px;
        height: 24px;
        margin-bottom: 12px;
    }
    // .shape-icon {
    //   padding: 6px;
    // }
    // .shape-icon {
    //   border: 1px solid #FFF;
    // }
    // .shape-icon:hover {
    //   border-color: #616571;
    // }
    .pitch {
      border-color:  #2e74ff !important;
    }
  }
}
</style>
