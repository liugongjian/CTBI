<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>

</template>

<script>
export default {
  name: 'SingleColumn',
  props: {
    dataValue: {
      type: String || Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      chartOption: {}
    }
  },
  watch: {
    color: {
      handler (val) {
        this.getOption()
      }
    }
  },

  mounted () {
    this.getOption()
  },
  methods: {
    getOption () {
      this.chartOption = {
        xAxis: {
          type: 'value',
          max: this.max,
          show: false

        },
        yAxis: {
          type: 'category',
          show: false
        },
        series: {
          type: 'bar',
          barWidth: 12,
          color: this.color,
          showBackground: true,
          data: [this.dataValue]
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
