<template>
  <div class="switcher">
    <div class="header">
      <span
        v-for="(item,index) in types"
        :key="index"
        class="chart-type"
        :class="item.type===type?'active':''"
        @click="goAuchor(`#${item.type}`)"
      >
        <span>{{ item.name }}</span>
      </span>
    </div>
    <div
      v-for="(item,index) in types"
      :id="item.type"
      :key="index"
      class="types"
    >
      <div class="title">{{ item.name }}</div>
      <div
        v-for="(item1,i) in filterTools(toolList, item)"
        :key="item1+i"
        class="sub-chart"
        :class="item1.name===option.theme.Basic.ChartType.type?'active':''"
      >
        <el-tooltip popper-class="content" placement="top-start">
          <svg-icon :icon-class="item1.name" style="font-size:26px;" />
          <div slot="content">
            <ChartDescription :chart-name="item1.name" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data () {
    return {
      toolList: {},
      type: this.option.type,
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
        // { name: '时序',
        //   type: 'sequence'
        // },
        { name: '空间',
          type: 'space'
        }
      ]

    }
  },
  mounted () {
    this.toolList = getToolList()
    this.goAuchor('#' + this.option.type)
  },
  methods: {
    filterTools(toolList, type) {
      const list = []
      const res = JSON.parse(JSON.stringify(toolList))
      Object.keys(res).forEach(item => {
        if (res[item].type !== type.type) {
          delete res[item]
        } else {
          res[item].name = item
          list.push(res[item])
        }
      })
      list?.sort((prev, next) => prev.order - next.order)
      return list
    },
    goAuchor(id) {
      this.type = id.split('#')[1]
      document.querySelector(id).scrollIntoView(true)
      var auchor = this.$el.querySelector(id)
      document.body.scrollTop = auchor.offsetTop
    }
  }
}
</script>
<style lang="scss" scoped>
.switcher {
  background: #383B47;
  padding: 12px 2px 0px 16px;
  // 滚动条样式优化
  ::-webkit-scrollbar {
    width: 6px;
    height: 100px;
  }
  // 外层轨道
  ::-webkit-scrollbar-track {
    background: #383B47;
  }

  // 滚动的滑块
  ::-webkit-scrollbar-thumb {
    background: rgba(221,221,221,0.25);
    border-radius: 6px;
  }

  // ::-webkit-scrollbar-thumb:hover {
  //   background: rgba(221,221,221,0.25);
  // }
  .types {
    .title{
      font-size: 12px;
      color: rgba(255,255,255,0.90);
      font-weight: 500;
      margin: 12px 0;

    }
    .sub-chart {
      display: inline-flex;
      margin-right: 17px;
      margin-bottom: 8px;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(221,221,221,0.65);
      border-radius: 2px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover{
        border: 1px solid rgba(255,255,255,1);
      }
    }
    .sub-chart.active{
      border: 1px solid rgba(250,131,52,1);
      border-radius: 2px;
    }
  }
  .chart-type {
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 2px;
    height: 22px;
    line-height: 22px;
    cursor: pointer;
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 12px;
    span{
      font-size: 12px;
      color: #FFFFFF;
      font-weight: 400;
      padding: 0 10px;
    }
    &:hover{
      border: 1px solid rgba(255,255,255,1);
    }
  }
  .chart-type.active{
    border: 1px solid rgba(250,131,52,1);
    border-radius: 2px;
    position: relative;
    &::after{
      display: block;
      content: " ";
      position: absolute;
      bottom: -1px;
      right: -1px;
      background-image: url(../../../assets/Image/selected.svg);
      background-size: 15px;
      background-repeat: no-repeat;
      width: 15px;
      height: 15px;
    }
  }
}

</style>
<style lang="scss">
.content.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: rgba(0,0,0,0.65);
}
.content.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: rgba(0,0,0,0.65);
}
.is-dark.content.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: rgba(0,0,0,0.65);
}
.is-dark.content.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
  border-bottom-color: rgba(0,0,0,0.65);
}
.content {
  background: rgba(0,0,0,0.65) !important;
}
</style>
