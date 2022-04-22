<template>
  <div class="editor-object-container">
    <div>
      <ColorConfig
        :color-data.sync="color"
        :title="option.title"
        @showColor="getColor"
      />
    </div>
  </div>
</template>
<script>
import ColorConfig from '@/components/Dashboard/Common/ColorConfig'
import store from '@/store'
export default {
  name: 'Color',
  components: {
    ColorConfig
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      color: []
    }
  },
  watch: {
    // 监听数据变化 变化后触发radar组件变化
    color: {
      handler (val) {
        console.log(this.color)
        this.option.color = val
      },
      deep: true
    }
  },
  methods: {
    getColor () {
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          this.color = item.option.theme.ComponentOption.Color.color
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
