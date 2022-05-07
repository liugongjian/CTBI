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
      type: Array,
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
        return this.axisData[0]?.max
      },
      set(val) {
        this.axisData[0].max = val
      }
    },
    axisMaxAuto: {
      get() {
        return this.axisData[0]?.auto
      },
      set(val) {
        this.axisData[0].auto = val
      }
    },
    axisMinVal: {
      get() {
        return this.axisData[1]?.min
      },
      set(val) {
        this.axisData[1].min = val
      }
    },
    axisMinAuto: {
      get() {
        return this.axisData[1]?.auto
      },
      set(val) {
        this.axisData[1].auto = val
      }
    }
  },
  watch: {
    data: {
      handler() {
        if (JSON.stringify(this.data) !== JSON.stringify(this.axisData) && this.data.length > 0) {
          this.axisData = deepClone(this.data)
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
