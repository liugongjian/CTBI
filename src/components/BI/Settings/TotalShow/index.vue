<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="显示总计"
      @change="handleSum"
    />{{ option }}
    <!-- 自定义总计名 -->
    <div v-show="option.show" class="editor-item-container flex-align-center">
      <div class="editor-item-title">自定义总计名</div>
      <div class="flex-align-center">
        <el-input
          v-model="option.name"
          placeholder=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'TotalShow',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dataSource: null
    }
  },
  mounted () {
  },
  methods: {
    handleSum () {
      // 显示总计
      const totalShow = this.option.show
      if (totalShow) {
        // 获取数据
        store.state.app.layout.forEach(item => {
          if (item.i === store.state.app.currentLayoutId) {
            this.dataSource = item.option.dataSource
          }
        })
        let sum = 0
        for (let i = 1; i < this.dataSource.length; i++) {
          sum += this.dataSource[i][1]
        }
        this.option.value = sum
      }
    }
  }
}
</script>

<style>
</style>
