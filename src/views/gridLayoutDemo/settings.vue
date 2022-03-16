<template>
  <div>
    <el-input
      v-model="val"
      type="textarea"
      autosize
      placeholder="请输入内容"
    />
    <el-button
      type="primary"
      @click="reflashStore"
    >更新</el-button>
  </div>

</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      val: '',
      layoutId: null
    }
  },
  mounted () {
    this.$bus.$on('reloadOption', this.reloadOption)
  },
  methods: {
    reloadOption ({ id, option }) {
      this.val = JSON.stringify(option)
      this.layoutId = id
    },
    reflashStore () {
      const layout = store.state.app.layout
      layout.map(item => {
        if (item.i === this.layoutId) {
          item.option = JSON.parse(this.val)
        }
      })
      store.dispatch('app/updateLayout', layout)
      this.$bus.$emit('reflashChart', this.layoutId)
    }
  }
}
</script>
