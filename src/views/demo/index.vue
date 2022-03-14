<template>
  <el-container>
    <el-header />
    <el-container>
      <el-container>
        <el-header class="header-tool">
          <div
            v-for="(item, index) in toolList"
            :key="item + index"
            class="droppable-element"
            draggable="true"
            unselectable="on"
            @click.stop="addItem(item)"
            @drag.stop="drag"
            @dragend="dragend($event, item)"
          >
            <svg-icon
              :icon-class="`chart_${item}`"
              style="font-size: 30px;"
            />
          </div>
        </el-header>
        <el-main class="main-layout">
          <div id="content">
            <widget ref="gridlayout" />
          </div>
        </el-main>
      </el-container>
      <el-aside>
        <settings />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import Widget from '@/components/FieldWidget/Widget.vue'
import settings from './settings.vue'
import store from '@/store'
const DragPos = { 'x': 1, 'y': 1, 'w': 1, 'h': 1, 'i': null }
const mouseXY = { 'x': 1, 'y': 1 }
const demoJSON = {
  'pie': {
    'tooltip': {
      'trigger': 'item'
    },
    'legend': {
      'top': '5%',
      'left': 'center'
    },
    'series': [
      {
        'name': 'Access From',
        'type': 'pie',
        'radius': ['40%', '70%'],
        'avoidLabelOverlap': false,
        'itemStyle': {
          'borderRadius': 10,
          'borderColor': '#fff',
          'borderWidth': 2
        },
        'label': {
          'show': false,
          'position': 'center'
        },
        'emphasis': {
          'label': {
            'show': true,
            'fontSize': '40',
            'fontWeight': 'bold'
          }
        },
        'labelLine': {
          'show': false
        },
        'data': [
          { 'value': 1048, 'name': 'Search Engine' },
          { 'value': 735, 'name': 'Direct' },
          { 'value': 580, 'name': 'Email' },
          { 'value': 484, 'name': 'Union Ads' },
          { 'value': 300, 'name': 'Video Ads' }
        ]
      }
    ]
  },
  'line': {
    'tooltip': {
      'trigger': 'axis',
      'axisPointer': {
        'type': 'cross'
      }
    },
    'color': ['#6700D8', '#FF0034', '#56A3F1', '#FF917C'],
    'legend': {
      'data': ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      'orient': 'horizontal',
      'left': 'middle',
      'top': 0
    },
    'xAxis': {
      'type': 'category',
      'data': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    'yAxis': {
      'type': 'value'
    },
    'series': [
      {
        'name': 'Email',
        'type': 'line',
        'stack': 'Total',
        'data': [120, 132, 101, 134, 90, 230, 210]
      },
      {
        'name': 'Union Ads',
        'type': 'line',
        'stack': 'Total',
        'data': [220, 182, 191, 234, 290, 330, 310]
      },
      {
        'name': 'Video Ads',
        'type': 'line',
        'stack': 'Total',
        'data': [150, 232, 201, 154, 190, 330, 410]
      },
      {
        'name': 'Direct',
        'type': 'line',
        'stack': 'Total',
        'data': [320, 332, 301, 334, 390, 330, 320]
      }
    ]
  },
  'radar': {
    'color': ['#6700D8', '#FF0034', '#56A3F1', '#FF917C'],
    'legend': {
      'orient': 'horizontal',
      'left': 'middle',
      'top': 0
    },
    'tooltip': {
      'trigger': 'item'
    },
    'radar': [
      {
        'indicator': [
          { 'name': 'Indicator1', 'max': 120 },
          { 'name': 'Indicator2', 'max': 10 },
          { 'name': 'Indicator3', 'max': 1 },
          { 'name': 'Indicator4', 'max': 100 },
          { 'name': 'Indicator5', 'max': 2000 },
          { 'name': 'Indicator6', 'max': 10 }
        ],
        'shape': '',
        'axisName': {
          'color': '#333'
        },
        'splitArea': {
          'areaStyle': {
            'color': ['#5ee7df', '#5ee7cf', '#5ee7bf', '#5ee7af', '#5ee79f'],
            'shadowColor': 'rgba(0, 0, 0, 0.2)',
            'shadowBlur': 10
          }
        },
        'axisLine': {
          'lineStyle': {
            'color': 'rgba(255, 255, 0, 1)'
          }
        },
        'splitLine': {
          'lineStyle': {
            'color': 'rgba(255, 255, 250, 0.8)'
          }
        }
      }
    ],
    'series': [
      {
        'type': 'radar',
        'emphasis': {
          'lineStyle': {
            'width': 4
          }
        },
        'data': [
          {
            'value': [100, 8, 0.4, 50, 2000, 1],
            'name': 'Data A'
          },
          {
            'value': [60, 5, 0.3, 80, 500, 10],
            'name': 'Data B'
          }
        ]
      }
    ]
  },
  'bar': {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['product', '2015', '2016', '2017'],
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1]
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }
}
export default {
  components: {
    Widget, settings
  },
  data () {
    return {
      // layout: [],
      layoutIndex: 100,
      toolList: ['bar', 'line', 'pie'],
      demoJSON
    }
  },
  computed: {
    layout: {
      get () {
        return store.state.app.layout
      },
      set (n) {
        store.dispatch('app/updateLayout', n)
      }
    }
  },
  mounted () {
    document.addEventListener('dragover', function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    }, false)
  },
  methods: {
    addItem: function (type) {
      // Add a new item. It must have a unique key!
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i: type + this.layoutIndex,
        is: 'v-chart',
        option: demoJSON[type]
      })
      // Increment the counter to ensure key is always unique.
      this.layoutIndex++
    },
    drag: function (e) {
      const parentRect = document.getElementById('content').getBoundingClientRect()
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 12) : 0,
          y: this.layout.length > 0 ? this.layout.length + (this.colNum || 12) : 0, // puts it at the bottom
          w: 12,
          h: 2,
          i: 'drop'
        })
      }
      const index = this.layout.findIndex(item => item.i === 'drop')
      if (index !== -1) {
        const el = this.$refs.gridlayout.$children[0].$children[index]
        el.dragging = { 'top': mouseXY.y - parentRect.top, 'left': mouseXY.x - parentRect.left }
        const new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
        if (mouseInGrid === true) {
          this.$refs.gridlayout.$children[0].dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 2, 12)
          DragPos.i = String(index)
          DragPos.x = this.layout[index].x
          DragPos.y = this.layout[index].y
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.$children[0].dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 2, 12)
          this.layout = this.layout.filter(obj => obj.i !== 'drop')
        }
      }
    },
    dragend: function (e, type) {
      const parentRect = document.getElementById('content').getBoundingClientRect()
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true) {
        this.$refs.gridlayout.$children[0].dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 2, 12)
        this.layout = this.layout.filter(obj => obj.i !== 'drop')
      }
      this.layout.push({
        x: DragPos.x,
        y: DragPos.y,
        w: 12,
        h: 2,
        i: type + String(DragPos.i) + new Date().getTime(),
        is: 'v-chart',
        option: demoJSON[type]
      })
      this.$refs.gridlayout.$children[0].dragEvent('dragend', type + String(DragPos.i) + new Date().getTime(), DragPos.x, DragPos.y, 2, 12)
    }
  }
}
</script>
<style lang="scss" scoped>
.header-tool {
  display: flex;
  align-items: center;
  border: 1px dotted;
  .droppable-element {
    margin: 0px 5px;
  }
}
.main-layout {
  border: 1px dotted;
  padding: 0px;
  height: calc(100vh - 240px);
  background: #f0f2f5;
}
</style>
