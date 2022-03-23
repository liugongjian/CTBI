<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.Basic.Endnodes.isShow"
      label="尾注"
    />
    <div class="editor-item-container" :class="{'box-disabled':!option.Basic.Endnodes.isShow}">
      <div><span>尾注内容：</span>
        <span
          class="el-icon-edit-outline"
          style="cursor:pointer"
          @click="showDialog"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Endnodes',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    // 显示修改尾注的弹窗
    showDialog () {
      const that = this
      this.$dialog.show('RTDialog', { text: that.option.Basic.Endnodes.text, title: '尾注内容' }, this.callback)
    },
    // 获取修改后的内容
    callback (val) {
      this.option.Basic.Endnodes.text = val
    }
  }

}
</script>

<style>
</style>
