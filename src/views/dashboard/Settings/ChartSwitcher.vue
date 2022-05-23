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
      <h3 style="color: aliceblue;">{{ item.name }}</h3>
      <div
        v-for="(sub,name,i) in filterTools(toolList, item.type)"
        :key="name+i"
        class="sub-chart"
      >
        <el-tooltip popper-class="content">
          <el-button><svg-icon :icon-class="name" style="font-size:20px;" /></el-button>
          <div slot="content">
            <ChartDescription :chart-name="name" />
          </div>
        </el-tooltip>

      </div>
    </div>
  </div>
</template>

<script>
// import store from '@/store'
import { getToolList } from '@/views/dashboard/Tools/getToolList.js'
import ChartDescription from './ChartDescription.vue'

export default {
  name: 'ChartSwitcher',
  components: {
    ChartDescription
  },
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
.switcher {
  background: #383B47;
}

.header {
  display: contents;
}

.chart-type {
  display: inline-flex;
  margin: 5px;
  // width: 48px;
  font-size: 20px;
}

.sub-chart {
  display: inline-flex;
  margin: 5px;
  // width: 50px;
}

.types {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.content.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: rgba($color: #6f6a6ab1, $alpha: 0.6);
}
.content.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: rgba($color: #6f6a6ab1, $alpha: 0.6);
}
.is-dark.content.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: rgba($color: #6f6a6ab1, $alpha: 0.6);
}
.is-dark.content.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
  border-bottom-color: rgba($color: #6f6a6ab1, $alpha: 0.6);
}
.content {
  background: rgba($color: #6f6a6ab1, $alpha: 0.9) !important;
}
</style>
