<template>
  <div class="editor-object-container">
    <div class="title">
      主题模式
    </div>
    <div class="editor-item-container">
      <div
        v-for="(item, index) in themes"
        :key="index"
        style="cursor: pointer"
        class="editor-item-container__theme"
        @click="() => selectTheme(item, index)"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div class="shape">
            <div class="shape-body" :class="{'active' : currentIndex === index }">
              <div
                class="shape_icon"
                :style="`background:${item.color};`"
              />
            </div>
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
    .shape-body {
      padding: 5px 6px;
      border: 1px solid transparent;
    }
    .shape-body.active {
      border: 1px solid #FA8334;
    }
    .shape_icon {
        width: 49px;
        height: 24px;
        background-color: #424550;
    }
  }
}
.title {
  color: rgba(255,255,255,0.75);
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
