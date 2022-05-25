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
        class="editor-item-container__theme"
        @click="() => selectTheme(item, index)"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div class="shape">
            <div
              class="shape_icon"
              :style="`background:${item.color};`"
              :class="{'active' : currentIndex === index }"
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
      ],
      currentIndex: 0
    }
  },
  methods: {
    selectTheme(theme, index) {
      this.currentIndex = index
      this.$store.state.settings.chartsStyles = { ...this.$store.state.settings.chartsStyles, background: theme.color }
    }
  }

}
</script>

<style lang="scss" scoped>
.editor-item-container {
    &__theme{
        margin-right: 15px;
    }
  display: flex;
  .shape {
    display: flex;
    flex-direction: column;
    text-align: center;
    .shape_icon {
        width: 49px;
        height: 24px;
        margin-bottom: 12px;
    }
    .pitch {
      border-color:  #2e74ff !important;
    }
  }
}
.active{
    border: 1px solid #FA8334;
}
</style>
