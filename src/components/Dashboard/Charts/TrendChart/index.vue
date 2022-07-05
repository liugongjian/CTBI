<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue" class="trendTitle" :class="{notOpen : !TrendChartConfig.open}">
      <div
        v-for="(titleItem, index) in titleList"
        :key="index"
        class="titleCont"
        :class="{center : trendStyleConfig.position == 'center'}"
        :style="[
          {minWidth:trendStyleConfig.lineNum?100/trendStyleConfig.lineNum+'%':'auto'},
          {borderRight:TrendChartConfig.type==='integration'?'1px solid #E5E5E5' :'' },
        ]"
        @click="changeTable(titleItem,index)"
      >
        <div
          style="margin:10px"
          :style="[
            {
              backgroundColor:TrendChartConfig.open&&titleItem.isSelect&&TrendChartConfig.type == 'disperse'?titleItem.color:!TrendChartConfig.open?'':TrendChartConfig.type==='disperse'?'#F5F5F5':''}
          ]"
        >
          <div class="subindicator" :class="{'subindicator-center' : trendStyleConfig.align == 'center'}">
            <div
              class="titleName"
              :style="[
                {color:TrendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].color :'#333' },
                {fontSize:trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].size+'px' :'' }
              ]"
            >{{ titleItem.name }}</div>
            <div
              class="titleValue"
              :style="[
                {color:TrendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].color :'#333' },
                {fontSize:TrendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].size+'px' :'' }
              ]"
            >{{ titleItem.value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>数据为空</div>
    <div
      v-if="TrendChartConfig.open && TrendChartConfig.type == 'disperse' && TrendChartConfig.preview == 'radio'"
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
    <div
      v-if="TrendChartConfig.open && TrendChartConfig.type == 'integration'"
      class="trendChartBox"
    >
      <v-chart
        v-for="(chart,key) of chartList"
        :key="key"
        ref="chart1"
        :style="[
          {borderRight:TrendChartConfig.type==='integration'?'1px solid #E5E5E5' :'' },
        ]"
        style="height:100%"
        :option="chart"
        autoresize
        :update-options="{notMerge:true}"
        @mouseover="handleMouseover"
      />
    </div>
    <div
      v-if="TrendChartConfig.open && TrendChartConfig.type == 'disperse' && TrendChartConfig.preview == 'multi'"
      class="trendChartBox"
    >222
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
    {{ chartOption }}this.chartList

  </div>
</template>

<script>
import lineMixins from '@/components/Dashboard/mixins/trendMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'TrendChart',
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
      type: 'TrendChart', // 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
      // 趋势图配置
      TrendChartConfig: {}
    }
  },
  methods: {
    // 指标带小趋势图 鼠标经过事件
    handleMouseover(e, e2) {
      console.log(e, e2)
    },
    handleClick(e) {
      console.log(e)
    },
    // 更改表单
    changeTable(item, index) {
      console.log(this.TrendChartConfig.preview)
      // 如果是单选
      if (this.TrendChartConfig.preview === 'radio') {
        this.titleList.map(item => {
          console.log(item.index === index)
          item.isSelect = item.index === index
          console.log(item)
        })
        this.selectedItem = this.chartList[index]
        console.log('selectedItem', this.selectedItem)
      } else {
        // 获取 true的数量，只有一个的时候不让取消
        let num = 0
        for (var tt of this.titleList) {
          console.log(tt)
          if (tt.isSelect) {
            num++
          }
        }
        if (num > 1) {
          console.log('如果是多选')
          this.titleList[index].isSelect = !this.titleList[index].isSelect
        } else if (!this.titleList[index].isSelect) {
          console.log('如果是多选22')
          this.titleList[index].isSelect = true
        }
      }
    },
    // // 鼠标经过
    // tenDepChartEvents(val) {
    //   console.log(val)
    // },

    getOption () {
      const { ComponentOption, FunctionalOption, TrendChartConfig, trendStyleConfig } = this.storeOption.theme
      this.titleList = TrendChartConfig.TrendChartConfig.titleList
      this.trendStyleConfig = trendStyleConfig.trendStyleConfig
      this.TrendChartConfig = TrendChartConfig.TrendChartConfig
      console.log(this.TrendChartConfig.preview)
      this.transformData(FunctionalOption.ChartFilter.selectedIndicator)
      // 如果是单选 TODU 处理series
      if (this.TrendChartConfig.preview === 'radio') {
        var serIndex = this.titleList.find(item => {
          console.log(11, item, item.isSelect, item.index)
          return item.isSelect ? item.index : '111'
        })
        console.log('serIndex', serIndex)
        this.getSeries(ComponentOption, FunctionalOption, serIndex)
      }

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
      console.log('配置信息', this.titleListTemp)
      var indicatorOption = this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption
      if (this.dataValue && this.dataValue[0].length > 1) {
        // 如果是单选
        if (this.TrendChartConfig.preview === 'radio') {
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
              series: this.series
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
            console.log('legendData', legendData)
            console.log('chartList', oldSelectedItem)
          }
        } else {
          // 如果是多选模式
          console.log('如果是多选', this.titleList)
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
          console.log('如果是多选', lineIds)
          // 获取指标筛选中的图例数据
          const legendData = []
          indicatorOption.forEach((item, index) => {
            console.log(item, index)
            if (lineIds.includes(index)) {
              legendData.push({ name: item.value })
            }
          })
          console.log(legendData)
          // 获取表的内容
          console.log(this.chartData)
          console.log('过滤后的shuju', this.formatDataValueMulti(deepClone(this.chartData), lineNames))
          this.dataValue = this.formatDataValueMulti(deepClone(this.chartData), lineNames)

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
              source: this.dataValue
            },
            dataZoom: {
              type: 'slider',
              show: FunctionalOption.DataZoom.showDataZoom !== 'hide',
              realtime: true,
              start: 0,
              end: 100,
              xAxisIndex: [0, 1]
            },
            series: this.series
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
    },
    getSeries (ComponentOption, FunctionalOption, index) {
      console.log('index', index)
      this.series = []
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
      this.twisYAxisConfig(ComponentOption)
      for (let i = 0; i < seriesLength; i++) {
        var chartType = this.TrendChartConfig.chart
        var seriesItem = {
          name: this.dataValue[0][i + 1],
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
        if (this.TrendChartConfig.chart === 'area') {
          seriesItem.type = 'line'
          seriesItem.areaStyle = {}
        }
        if (this.TrendChartConfig.open === false) {
          seriesItem.type = 'line'
        }
        this.series.push(seriesItem)
        if (ComponentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
        }
        if (!ComponentOption.SeriesMark.check) {
          this.series[i].symbol = 'circle'
          this.series[i].hoverAnimation = false
          this.series[i].symbolSize = 1
        } else {
          this.series[i].symbol = ComponentOption.SeriesMark.markType
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.trendChartBox{ height: 100%; width: 100%; display: flex; padding:10px auto}
.trendTitle{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 70px;
  .titleCont{
    .subindicator{ text-align: left; display: inline-block;
      margin:10px;
    }
    .subindicator-center{ text-align: center;}
    flex:1;
    >div{ border-radius: 6px;}
    .titleName{ font-size: 12px;}
    .titleValue{ font-size: 14px;}
    &.center{ text-align: center;}
  }
  &.notOpen{ height: 100%;justify-content: center;align-items: center;
    .titleCont{ border-right: 1px solid #E5E5E5;
    margin-right: -1px;
    &:last-child{ border-right: none;}
    .titleName{ font-size: 16px;}
    .titleValue{ font-size: 32px; font-weight: bolid;}

    }
  }
}
</style>
