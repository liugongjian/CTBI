<template>
  <div
    style="width:100%;height:100%;"
    :class="{
      titleLine : trendChartConfig.indicators=='line',
      titleLinefeed : trendChartConfig.indicators=='linefeed'
    }"
  >
    <div
      v-if="dataValue"
      style="width:100%;height:100%;"
    >
      <div
        v-if="dataValue && trendChartConfig.type == 'disperse'"
        class="trendTitle"
        :class="{
          notOpen : !trendChartConfig.open,
        }"
      >
        <div
          v-for="(titleItem, index) in titleList"
          :key="index"
          style="display:inline"
          :style="[
            {minWidth:trendStyleConfig.lineNum?100/trendStyleConfig.lineNum+'%':'auto'},
          ]"
          @click="changeTable(titleItem,index)"
        >
          <trendTitle
            :is-select="titleItem.isSelect"
            :trend-chart-config="trendChartConfig"
            :trend-style-config="trendStyleConfig"
            :title-item="titleItem"
            :index="index"
          />
        </div>
      </div>
      <div
        v-if="trendChartConfig.open && trendChartConfig.type == 'disperse' && trendChartConfig.preview == 'radio'"
        class="trendChartBox"
      >
        <v-chart
          v-if="selectedItem"
          ref="chart1"
          style="height:100%"
          :option="selectedItem"
          autoresize
          :update-options="{notMerge:true}"
          @click="handleClick"
          @mouseover="handleMouseover"
        />
      </div>
      <!-- 单独小指标图 -->
      <div
        v-if="trendChartConfig.open && trendChartConfig.type == 'integration'"
        class="trendChartBox"
        :class="{
          singleBox : trendChartConfig.indicators=='line',
        }"
      >
        <div
          v-for="(chart,key) of chartList"
          :key="key"
          :style="[
            {width:trendStyleConfig.lineNum?100/trendStyleConfig.lineNum-1+'%':'auto'},
            {borderRight:trendChartConfig.type==='integration'?'1px solid #E5E5E5' :'' },
          ]"
        >
          <trendTitle
            :trend-chart-config="trendChartConfig"
            :trend-style-config="trendStyleConfig"
            :title-item="titleList[key]"
            :index="key"
          />
          <v-chart
            :style="[
              {borderRight:trendChartConfig.type==='integration'?'1px solid #E5E5E5' :'' },
            ]"
            style="height:100%"
            :option="chart"
            autoresize
            :update-options="{notMerge:true}"
            @mouseover="handleMouseover"
          />

        </div>
      </div>
      <!-- 多选 -->
      <div
        v-if="trendChartConfig.open && trendChartConfig.type == 'disperse' && trendChartConfig.preview == 'multi'"
        class="trendChartBox"
      >
        <v-chart
          v-if="chartOption"
          ref="chart1"
          style="height:100%"
          :option="chartOption"
          autoresize
          :update-options="{notMerge:true}"
          @click="handleClick"
          @mouseover="handleMouseover"
        />
      </div>
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-trend"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import lineMixins from '@/components/Dashboard/mixins/trendMixins'
import { deepClone } from '@/utils/optionUtils'
import trendTitle from './trendTitle'
export default {
  name: 'TrendChart',
  components: {
    trendTitle
  },
  mixins: [lineMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedItem: '',
      dataValueItem: [],
      chartList: [],
      titleList: [], // 标题
      titleListTemp: [],
      Axis: {},
      type: 'TrendChart', // 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
      // 趋势图配置
      trendChartConfig: {}
    }
  },
  methods: {
    // 指标带小趋势图 鼠标经过事件
    handleMouseover (e, e2) {
      console.log(e, e2)
    },
    handleClick (e) {
      console.log(e)
    },
    // 更改表单
    changeTable (item, index) {
      // 如果是单选
      if (this.trendChartConfig.preview === 'radio') {
        console.log('单选')
        this.titleList.map(item => {
          item.isSelect = item.index === index
        })
        this.selectedItem = this.chartList[index]
      } else {
        // 获取 true的数量，只有一个的时候不让取消
        let num = 0
        for (var tt of this.titleList) {
          if (tt.isSelect) {
            num++
          }
        }
        if (num > 1) {
          this.titleList[index].isSelect = !this.titleList[index].isSelect
        } else if (!this.titleList[index].isSelect) {
          this.titleList[index].isSelect = true
        }
      }
    },
    // // 鼠标经过
    // tenDepChartEvents(val) {
    //   console.log(val)
    // },

    getOption () {
      const { ComponentOption, FunctionalOption, trendChartConfig, trendStyleConfig, Axis } = this.storeOption.theme
      this.Axis = Axis
      //
      this.titleList = trendChartConfig.trendChartConfig.titleList
      this.trendStyleConfig = trendStyleConfig.trendStyleConfig
      this.trendChartConfig = trendChartConfig.trendChartConfig
      // // 双Y轴配置放在了别的地方，这里赋值一下
      // ComponentOption.TwisYAxis = trendChartConfig.trendChartConfig.twoY
      var series = null
      this.transformData(FunctionalOption.ChartFilter.selectedIndicator)
      // 趋势图配置
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      ComponentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 获取指标筛选中的图例数据
      var legendData = []
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)
      // 如果设置了指标带小趋势图
      this.chartList = []
      var indicatorOption = this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption
      if (this.dataValue && this.dataValue[0].length > 1) {
        // 如果是单选
        if (this.trendChartConfig.preview === 'radio') {
          // 获取需要几个表
          const ctValueLength = this.dataValue[0].length - 1
          // 获取每个表的内容
          for (var ctValueIndex = 1; ctValueIndex <= ctValueLength; ctValueIndex++) {
            legendData = [
              {
                name: indicatorOption[ctValueIndex - 1].value
              }
            ]
            var ctDataValue = []
            // 获取单独表的内容
            this.dataValue.forEach(item => {
              var chartItemItem = [item[0], item[ctValueIndex]]
              ctDataValue.push(chartItemItem)
            })
            series = this.getSeries(ComponentOption, FunctionalOption, ctValueIndex)
            var chartItemOption = {
              index: ctValueIndex - 1,
              name: this.dataValue[0][ctValueIndex],
              grid: this.grid,
              color: colorOption,
              legend: {
                ...ComponentOption.Legend,
                data: legendData
              },
              xAxis: this.xAxis,
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              yAxis: this.yAxis,
              markPoint: this.markPoint,
              dataset: {
                source: ctDataValue
              },
              dataZoom: {
                type: 'slider',
                show: FunctionalOption.DataZoom.showDataZoom !== 'hide',
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1]
              },
              series: series
            }
            // 赋值 避免切换类型不更新的bug
            const oldSelectedItem = deepClone(this.selectedItem)
            if (ctValueIndex === 1 && !this.selectedItem) {
              this.selectedItem = chartItemOption
            }
            if (oldSelectedItem.index === chartItemOption.index) {
              this.selectedItem = chartItemOption
            }
            this.chartList.push(chartItemOption)
          }
        } else {
          // 如果是多选模式
          series = this.getSeriess(ComponentOption, FunctionalOption)
          var lineIds = []
          var lineNames = []
          // var dataValueIncludesKeys = []
          // const dataValueNames = this.dataValue[0]
          this.titleList.forEach(item => {
            if (item.isSelect) {
              lineIds.push(item.index)
              lineNames.push(item.name)
            }
          })
          // 获取指标筛选中的图例数据
          const legendData = []
          indicatorOption.forEach((item, index) => {
            if (lineIds.includes(index)) {
              legendData.push({ name: item.value })
            }
          })
          // 获取表的内容
          const dataValue = this.formatDataValueMulti(deepClone(this.chartData), lineNames)

          this.chartOption = {
            grid: this.grid,
            color: colorOption,
            legend: {
              ...ComponentOption.Legend,
              data: legendData
            },
            xAxis: this.xAxis,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            yAxis: this.yAxis,
            markPoint: this.markPoint,
            dataset: {
              source: dataValue
            },
            dataZoom: {
              type: 'slider',
              show: FunctionalOption.DataZoom.showDataZoom !== 'hide',
              realtime: true,
              start: 0,
              end: 100,
              xAxisIndex: [0, 1]
            },
            series: series
          }
          // this.dataValue.forEach((item, in dex) => {
          //   dataValueNames.forEach((vName, vKey) => {
          //     if (lineNames.includes(vName)) {
          //     var data = [[vName]]
          //       console.log(vName)
          //     }
          //   })
          // })
        }
      }
      // 多选切换时显示多个的bug
      if (this.trendChartConfig.preview === 'radio') {
        var k = 0
        this.titleList.forEach(item => {
          if (item.isSelect) { k++ }
        })
        if (k > 1) {
          this.changeTable(this.titleList[0], 0)
        }
      }
      this.$forceUpdate()
    },
    getSeries (ComponentOption, FunctionalOption, ctValueIndex) {
      var series = []
      let seriesLength = 0
      if (this.dataValue && this.dataValue.length > 0) {
        this.dataValue.forEach(item => {
          seriesLength = item.length - 1
        })
      } else {
        return
      }
      this.setAxis()
      // 双Y轴设置
      // this.twisYAxisConfig(ComponentOption)
      // for (let i = 0; i < seriesLength; i++) {
      var i = 0
      var chartType = this.trendChartConfig.chart
      var seriesItem = {
        name: this.dataValue[0][ctValueIndex],
        label: {
          show: ComponentOption.ChartLabel.check, // 标签显示
          position: 'top' // 标签位置
        },
        labelLayout: {
          hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
        },
        smooth: ComponentOption.LineStyle.type === 1,
        connectNulls: this.resolveNull(FunctionalOption),
        itemStyle: this.getItemStyle(ComponentOption), // 图形样式配置-颜色
        type: chartType
      }
      // 面积图单独处理
      if (this.trendChartConfig.chart === 'area') {
        seriesItem.type = 'line'
        seriesItem.areaStyle = {}
      }
      if (this.trendChartConfig.open === false) {
        seriesItem.type = 'line'
      }
      series.push(seriesItem)
      if (ComponentOption.TwisYAxis.check) {
        const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
        series[i].yAxisIndex = yAxisIndex
      }
      if (!ComponentOption.SeriesMark.check) {
        series[i].symbol = 'circle'
        series[i].hoverAnimation = false
        series[i].symbolSize = 1
      } else {
        series[i].symbol = ComponentOption.SeriesMark.markType
      }
      return series
      // }
    },
    getSeriess (ComponentOption, FunctionalOption, index) {
      const dataValue = deepClone(this.dataValue)
      var series = []
      let seriesLength = 0
      if (dataValue && dataValue.length > 0) {
        dataValue.forEach(item => {
          seriesLength = item.length - 1
        })
      } else {
        return
      }
      this.setAxis()
      // 双Y轴设置
      // this.twisYAxisConfig(ComponentOption)
      for (let s = 0; s < seriesLength; s++) {
        var i = 0
        if (this.titleList[s].isSelect) {
          var chartType = this.trendChartConfig.chart
          var seriesItem = {
            name: dataValue[0][s + 1],
            label: {
              show: ComponentOption.ChartLabel.check, // 标签显示
              position: 'top' // 标签位置
            },
            labelLayout: {
              hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
            },
            smooth: ComponentOption.LineStyle.type === 1,
            connectNulls: this.resolveNull(FunctionalOption),
            itemStyle: this.getItemStyle(ComponentOption), // 图形样式配置-颜色
            type: chartType
          }
          // 面积图单独处理
          if (this.trendChartConfig.chart === 'area') {
            seriesItem.type = 'line'
            seriesItem.areaStyle = {}
          }
          if (this.trendChartConfig.open === false) {
            seriesItem.type = 'line'
          }
          series.push(seriesItem)
          if (ComponentOption.TwisYAxis.check) {
            const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
            series[i].yAxisIndex = yAxisIndex
          }
          if (!ComponentOption.SeriesMark.check) {
            series[i].symbol = 'circle'
            series[i].hoverAnimation = false
            series[i].symbolSize = 1
          } else {
            series[i].symbol = ComponentOption.SeriesMark.markType
          }
          i++
        }
      }
      return series
    }
  }
}
</script>

<style lang="scss" scoped>
.trendChartBox {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 10px auto;
}
.trendTitle {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &.notOpen {
    height: 100%;
    justify-content: center;
    align-items: center;
    .titleCont {
      border-right: 1px solid #e5e5e5;
      margin-right: -1px;
      &:last-child {
        border-right: none;
      }
      .titleName {
        font-size: 16px;
      }
      .titleValue {
        font-size: 32px;
        font-weight: bolid;
      }
    }
  }
}
.titleLine {
  .trendTitle {
    display: block;
    width: auto;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    .titleCont {
      display: inline-block;
    }

    &::-webkit-scrollbar-track-piece {
      background-color: #fff;
    }
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb:horizontal {
      width: 100px;
      background-color: #999;
      border-radius: 6px;
      border-radius: 6px;
    }
  }
}
.singleBox {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  > div {
    height: 100%;
  }
}
</style>
