<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 15:38:03
 * @Description:
-->
<template>
  <div>
    <div class="container">
      <div id="liquidfill-chart" ref="liquidfill" style="width:150px; height:150px" />
      <div class="box">
        <div>
          <span :style="stylePercent">{{ setProgress }}%</span><br>
          <span :style="styleTitle">{{ data.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="getValueShow" class="text" :style="styleDesc">
      <span>{{ option.value.current }} {{ data.value }}</span>
      <br>
      <span>{{ option.value.target }} {{ target }}</span>
    </div>
  </div>
</template>

<script>
import progressMixins from './progressMixins'
import 'echarts-liquidfill'
import * as echarts from 'echarts'
export default {
  name: 'WaterWave',
  mixins: [progressMixins],
  computed: {
    // 0-1 占比
    setProgressData () {
      const num = (this.data.value / this.target).toFixed(2)
      return num > 1 ? 1 : num
    }
  },
  watch: {
    setProgressData () {
      this.getInit()
    },
    getColor () {
      this.getInit()
    }
  },
  mounted () {
    this.getInit()
  },
  methods: {
    getInit () {
      var chart = echarts.init(this.$refs.liquidfill)
      var option = {
        series: [{
          type: 'liquidFill',
          radius: '98%',
          data: [{ }, this.setProgressData],
          color: [this.getColor],
          label: {
            show: false
          },
          backgroundStyle: {
            color: '#fff',
            borderColor: '#fff'
          },
          itemStyle: {
            shadowColor: '#fff'
          },
          outline: {
            show: true,
            borderDistance: 3,
            itemStyle: {
              borderColor: '#e5e7ee',
              borderWidth: 3
            }
          }
        }]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  .box {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, 0%);
    text-align: center;
  }
}
.text {
  margin-bottom: 10px;
}
</style>
