<template>
  <div>
    <el-button
      type="primary"
      @click="saveCanvas"
    >保存</el-button>
    <el-button
      @click="clearCanvas"
    >清空</el-button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    // 保存画布
    saveCanvas () {
      const layout = JSON.stringify(this.$store.state.app.layout)
      localStorage.setItem('layout', layout)
      this.$notify.success({
        title: '成功',
        message: '保存成功'
      })
    },

    // 清空画布
    clearCanvas () {
      this.$store.state.app.layout = []
      localStorage.removeItem('layout')
    }
  }
}
</script>

<style>
</style>
