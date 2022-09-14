<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-13 15:31:22
 * @Description:
-->
<template>
  <div
    v-if="headVisible"
    class="editor-object-container"
  >
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
      default: () => { }
    }
  },
  computed: {
    headVisible () {
      let res
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          res = !item.option.theme.DisplayConfig.TableTheme.visible
        }
      })
      return res
    }
  }
}
</script>

<style>
</style>
