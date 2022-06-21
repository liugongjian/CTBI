/* eslint-disable vue/no-template-shadow */
/**
 * tab添加逻辑组件
 * 用户添加Tab组件时，向store.layout 中添加一个新is是TabChart的layout对象，同时该对象中含有类型为数组的tabPanes的属性，
 * 其中含有{name, paneId: tabId + name}的tabPane;
 * 用户可以向tabPanes中添加或者减少tabPane, tabPane的内容是一个GridLayout； 当用户向tab中添加Chart时，就是
 * 向store.layout 中添加一个新is是该Chart的layout对象，同时该对象多一个containerId的属性,值是tabId
 * 渲染TabPane时，就是渲染GridLayout，GridLayout的layout的值就是store中所有containerId是该TabPane的tabId的layout的集合
 */
<template>
  <div style="width:100%;height:100%;">
    <el-tabs v-model="editableTabsValue" type="card" addable closable @tab-remove="removeTab" @tab-add="addTab">
      <el-tab-pane
        v-for="itm in editableTabs"
        :key="itm.name"
        :label="itm.title"
        :name="itm.name"
      >
        <grid-layout
          :layout.sync="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="true"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :static="item.static"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
          >
            <span class="text">{{ itemTitle(item) }}</span>
          </grid-item>
        </grid-layout>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import barMixins from '@/components/Dashboard/mixins/barMixins'
import { GridLayout, GridItem } from 'vue-grid-layout'
export default {
  name: 'TabChart',
  // mixins: [barMixins],
  components: {
    GridLayout,
    GridItem
  },
  data () {
    return {
      type: 'TabChart', // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2,
      layout: [
        { 'x': 0, 'y': 0, 'w': 2, 'h': 1, 'i': '0', static: false },
        { 'x': 2, 'y': 1, 'w': 2, 'h': 1, 'i': '1', static: false },
        { 'x': 4, 'y': 2, 'w': 2, 'h': 1, 'i': '2', static: false }
      ],
      draggable: true,
      resizable: true,
      index: 0
    }
  },
  methods: {
    removeTab(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    addTab() {
      const newTabName = ++this.tabIndex + ''
      this.editableTabs.push({
        title: 'New Tab12222222222',
        name: newTabName,
        content: 'New Tab content'
      })
      this.editableTabsValue = newTabName
    },
    dragover (event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    // 清空CurrentLayoutId来显示页面配置
    clearCurrentLayoutId () {
      this.$store.state.app.currentLayoutId = ''
    },
    itemTitle(item) {
      let result = item.i
      if (item.static) {
        result += ' - Static'
      }
      return result
    },
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getSeries(componentOption) // 获取Series

      // 将图表转为堆积柱状图
      if (componentOption.PercentStack.isStack && !componentOption.PercentStack.isPercent) {
        this.getStackSeries(componentOption)
      }
      // 将图表转为百分比堆积柱状图
      if (componentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(componentOption)
      }

      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      componentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 设置图例与图表距离
      this.setGrid(componentOption.Legend)

      // 获取指标筛选中的图例数据
      const legendData = []
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
        legendData.push({ name: item.value })
      })
      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': {
          ...componentOption.Legend,
          data: legendData
        },
        'xAxis': this.xAxis,
        'tooltip': {
          trigger: 'axis'
        },
        'yAxis': this.yAxis,
        'markPoint': this.markPoint,
        'dataset': {
          'source': this.dataValue
        },
        'dataZoom': {
          'type': 'slider',
          'show': this.storeOption.theme.FunctionalOption.DataZoom.showDataZoom !== 'hide',
          'realtime': true,
          'start': 0,
          'end': 100,
          'xAxisIndex': [0, 1]
        },
        'series': this.series
      }
    },
    getSeries (componentOption) {
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
      this.twisYAxisConfig(componentOption)

      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
        }
      }
    }
  }
}
</script>

<style>
</style>
