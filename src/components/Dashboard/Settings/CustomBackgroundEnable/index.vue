<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="自定义背景填充"
    />

    <!-- 卡片颜色 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">卡片颜色</div>
      <div class="flex-align-center">
        <el-color-picker v-model="option.color" />
      </div>
    </div>

    <!-- 背景图片 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <el-checkbox
        v-model="option.showImg"
        label="背景图片"
      />
      <el-popover
        placement="top-end"
        width="365"
        trigger="click"
        :class="{'box-disabled':!option.showImg}"
      >
        <upload-img-inner :option="option" />
        <div
          slot="reference"
          class="upload-img-wrapper"
        >
          <img
            v-if="option.imgUrl"
            :src="option.imgUrl"
            style="width:12px;height:12px"
          >
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import UploadImgInner from './UploadImgInner.vue'
export default {
  name: 'CustomBackgroundEnable',
  components: { UploadImgInner },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.upload-img-wrapper {
  width: 38px;
  height: 24px;
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  border-radius: 2px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
