<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="轮廓与填充"
    />

    <!-- 区块底色 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">区块底色</div>
      <div class="flex-align-center">
        <el-color-picker v-model="option.areaColor" @change="changeBg" />
      </div>
    </div>

    <!-- 轮廓线 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">轮廓线</div>
      <div class="flex-align-center">
        <el-color-picker v-model="option.borderColor" @change="changeBorder" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'MapItemStyle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    changeBg(color) {
      if (!color) {
        this.option.areaColor = '#EBEDF0'
      }
    },
    changeBorder(color) {
      if (!color) {
        this.option.borderColor = '#FFFFFF'
      }
    }
  }

}
</script>

