<template>
  <div class="switcher">
    <div class="header">
      <span
        v-for="(item,index) in types"
        :key="index"
        class="chart-type"
      >
        <el-button>{{ item.name }}</el-button>
      </span>
    </div>
    <div
      v-for="(item,index) in types"
      :key="index"
      class="types"
    >
      <h3>{{ item.name }}</h3>
      <div
        v-for="(sub,name,i) in filterTools(toolList, item.type)"
        :key="name+i"
        class="sub-chart"
      >
        <el-button><svg-icon :icon-class="name" style="font-size:20px;" /></el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import store from '@/store'
import { getToolList } from '@/views/dashboard/Tools/getToolList.js'

export default {
  name: 'ChartSwitcher',
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    chartName: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      toolList: {},
      types: [
        { name: '指标',
          type: 'indicator'
        },
        { name: '表格',
          type: 'table'
        },
        { name: '趋势',
          type: 'trend'
        },
        { name: '比较',
          type: 'comparator'
        },
        { name: '分布',
          type: 'distribution'
        },
        { name: '关系',
          type: 'relation'
        },
        { name: '时序',
          type: 'sequence'
        },
        { name: '空间',
          type: 'space'
        }
      ]

    }
  },
  mounted () {
    this.toolList = getToolList()
  },
  methods: {
    filterTools(toolList, type) {
      const res = JSON.parse(JSON.stringify(toolList))
      Object.keys(res).forEach(item => {
        if (res[item].type !== type) {
          delete res[item]
        }
      })
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: contents;
}

.chart-type {
  display: inline-flex;
  margin: 5px;
  width: 48px;
  font-size: 20px;
}

.sub-chart {
  display: inline-flex;
  margin: 5px;
  width: 50px;
}
</style>
