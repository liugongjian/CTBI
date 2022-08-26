<template>
  <div class="editor-object-container">
    <div class="flex-align-center">
      <div class="editor-item-title">每行展示个数设置(最多)</div>
      <el-select v-model="option.showNum" popper-class="setting-select" placeholder="请选择">
        <el-option
          v-for="item in showNumOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="m-t-12">
      <div class="editor-item-title">主指标</div>
      <div v-for="(item, index) in option.indicators" :key="index" class="editor-item-container flex-align-center">
        <div class="editor-item-title">{{ item.name }}</div>
        <el-color-picker v-model="item.color" class="m-r-8" />
        <el-select v-model="item.fontSize" popper-class="setting-select" placeholder="请选择">
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
    </div>
    <div class="m-t-12">
      <el-checkbox v-model="option.value.show">显示当前值/目标值</el-checkbox>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">当前值-展示名称</div>
        <el-input v-model="option.value.current" placeholder="请输入内容" />
      </div>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">目标值-展示名称</div>
        <el-input v-model="option.value.target" placeholder="请输入内容" />
      </div>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">样式</div>
        <el-color-picker v-model="option.value.style.color" class="m-r-8" />
        <el-select v-model="option.value.style.fontSize" popper-class="setting-select" placeholder="请选择">
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
    </div>
    <div>
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
  name: 'ProgressStyle',
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
      showNumOptions: [1, 2, 3, 4],
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
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
      const item = store.state.app.layout.find(item => store.state.app.currentLayoutId === item.i) || {}
      this.radarColor = item.option.theme.ComponentOption.ProgressStyle.color
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
