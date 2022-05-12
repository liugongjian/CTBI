export default {
  data: function () {
    return {
      dialogVisible: false,
      callback: undefined,
      loading: false
    }
  },
  methods: {
    close (data) {
      if (typeof this.callback === 'function') {
        this.loading = true
        this.callback(data)
        this.loading = false
      }
      this.dialogVisible = false
      this.destroyed()
    },
    closeSilence () {
      this.dialogVisible = false
      this.destroyed()
    },
    // 删除dom节点
    destroyed () {
      // if appendToBody is true, remove DOM node after destroy
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
}
