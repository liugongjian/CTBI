<template>
  <div class="editor-object-container">
    <div class="item-num">
      <span>每行展示个数设置(最多)</span>
      <el-select v-model="option.showNum" class="w-select" placeholder="请选择">
        <el-option
          v-for="item in showNumOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div>
      主指标
      <div v-for="(item, index) in option.indicators" :key="index" class="indicators">
        {{ item.name }}
        <el-color-picker v-model="item.color" />
        <el-select v-model="item.fontSize" class="w-select" placeholder="请选择">
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
      <el-checkbox v-model="option.value.show">显示当前值/目标值</el-checkbox>
      <div class="box">
        <span>当前值-展示名称</span>
        <el-input v-model="option.value.current" placeholder="请输入内容" />
      </div>
      <div class="box">
        <span>目标值-展示名称</span>
        <el-input v-model="option.value.target" placeholder="请输入内容" />
      </div>
      <div class="box">
        <span>样式</span>
        <el-color-picker v-model="option.value.style.color" />
        <el-select v-model="option.value.style.fontSize" class="w-select" placeholder="请选择">
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
    </div>
    <div style="height:200px">
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
      this.radarColor = item.option.theme.ComponentOption.progressStyle.color
    }
  }
}
</script>

<style lang="scss" scoped>
.item-num {
  display: flex;
  align-items: center;
  .w-select {
    margin-left: 5px;
    flex: 1;
  }
}
.indicators {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  .el-select {
    flex: 1;
  }
}
.el-color-picker {
  margin: 0 5px;
}
.box {
  display: flex;
  align-items: center;
  margin: 5px 15px;
  .el-input {
    margin-left: 5px;
    flex: 1
  }
  .el-select {
    flex: 1;
  }
}
</style>
