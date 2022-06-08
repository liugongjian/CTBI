<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox
        v-model="checked"
        @change="changeChecked"
      >节点之间面积填充</el-checkbox>
      <ColorConfig
        :color-data.sync="radarColor"
        @showColor="getRadarColor"
      />
    </div>
  </div>
</template>
<script>
import ColorConfig from '@/components/Dashboard/Common/ColorConfig'
import store from '@/store'
export default {
  name: 'RadarColor',
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
      checked: false,
      radarColor: []
    }
  },
  watch: {
    // 监听数据变化 变化后触发radar组件变化
    radarColor: {
      handler (val) {
        this.option.color = val
      },
      deep: true
    }
  },
  methods: {
    getRadarColor () {
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          this.radarColor = item.option.theme.ComponentOption.RadarColor.color
          console.log(this.radarColor)
        }
      })
    },
    changeChecked (val) {
      this.option.areaStyle = val
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
