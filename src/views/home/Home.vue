<template>
  <div class="home">
    <h1>{{ name }}</h1>
    <el-button type="primary">测试样式切换按钮</el-button>
    <el-button
      type="text"
      @click="showDialog"
    >点击打开弹窗</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    showDialog () {
      this.$dialog.show('TestDialog', {}, this.callback)
    },
    callback () {
      this.$message('这是一条确定关闭提示')
    }
  }
}
</script>
