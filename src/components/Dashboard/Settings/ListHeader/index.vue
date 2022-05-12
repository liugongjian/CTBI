<template>
  <div v-if="headVisible" class="editor-object-container">
    <el-checkbox v-model="option.head">不显示列表头</el-checkbox>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'ListHeader',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    headVisible() {
      let res
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          res = item.option.theme.DisplayConfig.TableTheme.visible
        }
      })
      return res
    }
  }
}
</script>

<style>

</style>
