<template>
  <div>
    <div class="axis">
      最大值
      <el-input v-model="axisMaxVal" placeholder="请输入内容" :disabled="axisMaxAuto" />
      <el-checkbox v-model="axisMaxAuto">自动</el-checkbox>
    </div>
    <div class="axis">
      最小值
      <el-input v-model="axisMinVal" placeholder="请输入内容" :disabled="axisMinAuto" />
      <el-checkbox v-model="axisMinAuto">自动</el-checkbox>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'Axis',
  props: {
    data: {
      type: Object,
      default: () => ([])
    }
  },
  data () {
    return {
      axisData: []
    }
  },
  computed: {
    axisMaxVal: {
      get() {
        return this.axisData.max
      },
      set(val) {
        this.axisData.max = val
      }
    },
    axisMaxAuto: {
      get() {
        return this.axisData.maxAuto
      },
      set(val) {
        this.axisData.maxAuto = val
        if (val) {
          this.axisData.max = ''
        }
      }
    },
    axisMinVal: {
      get() {
        return this.axisData.min
      },
      set(val) {
        this.axisData.min = val
      }
    },
    axisMinAuto: {
      get() {
        return this.axisData.minAuto
      },
      set(val) {
        this.axisData.minAuto = val
        if (val) {
          this.axisData.min = ''
        }
      }
    }
  },
  watch: {
    data: {
      handler() {
        if (JSON.stringify(this.data) !== JSON.stringify(this.axisData)) {
          this.axisData = deepClone(this.data)
          console.log(this.axisData)
        }
      },
      deep: true,
      immediate: true
    },
    axisData: {
      handler() {
        this.$emit('update:data', this.axisData)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.axis {
  display: flex;
  align-items: center;
  margin-top: 5px;
  .el-input {
    flex:1;
    margin: 0 5px;
  }
}
</style>
