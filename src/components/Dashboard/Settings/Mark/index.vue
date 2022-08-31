<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="备注"
    />
    <div
      class="editor-item-container"
      :class="{'box-disabled':!option.show}"
    >
      <div><span style="margin-right: 8px">备注内容</span>
        <span
          class="el-icon-edit-outline"
          style="cursor:pointer"
          @click="showDialog"
        />
      </div>
      <div style="display: flex;align-items: center;margin-top: 12px">
        <span style="margin-right: 8px">位置</span>
        <el-radio-group v-model="option.position">
          <el-radio label="afterTitle">紧跟标题</el-radio>
          <el-radio label="onChart">图表上方</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mark',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    // 显示修改备注的弹窗
    showDialog () {
      const that = this
      this.$dialog.show('RTDialog', { text: that.option.text, title: '备注内容' }, this.callback)
    },
    // 获取修改后的内容
    callback (val) {
      this.option.text = val
    }
  }

}
</script>

<style>
</style>
