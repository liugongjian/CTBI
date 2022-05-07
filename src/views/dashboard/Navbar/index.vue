<template>
  <div class="bi-header-container">
    <button
      class="bi-header-btn default"
      @click="saveCanvas"
    >保存</button>
    <button
      class="bi-header-btn default"
      @click="clearCanvas"
    >清空</button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    // 保存画布
    saveCanvas () {
      const layout = JSON.stringify(this.$store.state.app.layout)
      const dataOption = JSON.stringify(this.$store.state.app.dataOption)
      localStorage.setItem('layout', layout)
      localStorage.setItem('dataOption', dataOption)
      this.$notify.success({
        title: '成功',
        message: '保存成功'
      })
    },

    // 清空画布
    clearCanvas () {
      this.$store.state.app.layout = []
      this.$store.state.app.dataValue = []
      this.$store.state.app.currentLayoutId = ''
      localStorage.removeItem('layout')
      localStorage.removeItem('dataValue')
    }
  }
}
</script>
