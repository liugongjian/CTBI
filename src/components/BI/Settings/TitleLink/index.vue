<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="展示链接跳转"
    />
    <div v-show="option.show">
      <!-- 链接文案 -->
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">链接文案</div>
        <div class="flex-align-center">
          <el-input
            v-model="option.text"
            placeholder="链接跳转"
          />
          <el-tooltip
            placement="top"
            effect="dark"
            content="建议按左侧宽度填写内容，超出将按...显示"
          >
            <i class="el-icon-warning-outline m-l-5" />
          </el-tooltip>
        </div>
      </div>

      <!-- 链接地址 -->
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">链接地址</div>
        <div class="flex-align-center">
          <el-input
            v-model="option.url"
            placeholder="https://"
          />
        </div>
      </div>

      <!-- 打开方式 -->
      <div class="editor-item-container"><span>打开方式</span>
        <el-radio-group v-model="option.openType">
          <el-radio label="blank">新窗口</el-radio>
          <el-radio label="dialog">弹窗</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleLink',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      storeOption: this.option
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (val.url.slice(0, 4) === 'www.') {
          val.url = 'https://' + val.url
        }
      },
      deep: true
    }
  }
}
</script>

<style>
</style>
