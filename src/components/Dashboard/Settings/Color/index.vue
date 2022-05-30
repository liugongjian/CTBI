<template>
  <div v-if="typeof option.show === 'undefined' ? true : option.show" class="editor-object-container">
    <div>
      <ColorConfig
        :option="option"
        @showColor="getColor"
      />
    </div>
  </div>
</template>
<script>
import ColorConfig from './ColorConfig.vue'
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
        this.option.color = val
      },
      deep: true
    }
  },
  mounted() {
    this.getColor()
  },
  methods: {
    getColor () {
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          const option = item.option.theme.ComponentOption || item.option.theme.DisplayConfig
          this.color = option.Color.color
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
