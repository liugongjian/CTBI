<template>
  <div
    class="titleCont"
    :class="{
      'center' : trendStyleConfig.position == 'center',
      'subindicator-center' : trendStyleConfig.align == 'center'
    }"
    :style="[
      {minWidth:trendStyleConfig.lineNum?100/trendStyleConfig.lineNum+'%':'auto'},
    ]"
  >
    {{ titleItem.color.color }}
    <div
      style="margin:10px;"
      :style="[
        {
          backgroundColor:trendChartConfig.open&&isSelect&&trendChartConfig.type == 'disperse'?titleItem.color:!trendChartConfig.open?'':trendChartConfig.type==='disperse'?'#F5F5F5':'',

        }
      ]"
    >
      <div class="subindicator" :class="{'subindicator-center' : trendStyleConfig.align == 'center'}">
        <div
          class="titleName"
          :style="[
            {color:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].color :'#333' },
            {fontSize:trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].size+'px' :'' },
          ]"
        >
          {{ titleItem.name }}
        </div>
        <div
          class="titleValue"
          :style="[
            {color:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].color :'#333' },
            {fontSize:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].size+'px' :'' }
          ]"
        >
          <!-- 如果配置了自定义样式而且  -->
          <span v-if="titleItem.formatting.styleCustomType === false">
            <!-- 文字展示 -->
            <span v-if="titleItem.formatting.quickStyle.selected === 'num'">
              <span v-if="titleItem.value > 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#26BF6A': '#F65252'}">{{ titleItem.value }}</strong>
              </span>
              <span v-if="titleItem.value === 0">
                <strong :style="{'color': '#ECD432'}">{{ titleItem.value }}</strong>
              </span>
              <span v-if="titleItem.value < 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#F65252': '#26BF6A'}">{{ titleItem.value }}</strong>
              </span>
            </span>
            <!-- 箭头展示 -->
            <span v-else-if="titleItem.formatting.quickStyle.selected === 'arraw'">
              <span v-if="titleItem.value > 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#26BF6A': '#F65252'}">{{ titleItem.value }} <svg-icon icon-class="arrowTop" /></strong>
              </span>
              <span v-if="titleItem.value === 0">
                <strong :style="{'color': '#ECD432'}">{{ titleItem.value }} <svg-icon icon-class="arrowRight" /></strong>
              </span>
              <span v-if="titleItem.value < 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#F65252': '#26BF6A'}">{{ titleItem.value }} <svg-icon icon-class="arrowDown" /></strong>
              </span>
            </span>
            <!-- 插入展示 -->
            <span v-else-if="titleItem.formatting.quickStyle.selected === 'caret'">
              <span v-if="titleItem.value > 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#26BF6A': '#F65252'}">{{ titleItem.value }} <svg-icon icon-class="markTop" /></strong>
              </span>
              <span v-if="titleItem.value === 0">
                <strong :style="{'color': '#ECD432'}">{{ titleItem.value }} <svg-icon icon-class="markLine" /></strong>
              </span>
              <span v-if="titleItem.value < 0">
                <strong :style="{'color':titleItem.formatting.quickStyle.reverse?'#F65252': '#26BF6A'}">{{ titleItem.value }} <svg-icon icon-class="markDown" /></strong>
              </span>
            </span>
            <strong v-else>
              {{ titleItem.value }}
            </strong>
          </span>
          <!-- 如果设置了自定义样式 -->
          <span v-else-if="titleItem.formatting.styleCustomType">
            <span>
              todo
            </span>
            <span>
              {{ titleItem.value }}
            </span>
          </span>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { boolean } from 'yargs'

export default {
  name: 'TrendTitle',
  props: {
    trendChartConfig: {
      type: Object,
      default: () => { }
    },
    trendStyleConfig: {
      type: Object,
      default: () => { }
    },
    titleItem: {
      type: Object,
      default: () => { }
    },
    isSelect: {
      type: Boolean,
      default: () => true
    },
    // 背景色
    bgColor: {
      type: String,
      default: () => ''
    }

  }
}
</script>

<style lang="scss">

  .titleCont{
    flex:1;
    >div{ border-radius: 6px;}
    .titleName{ font-size: 12px;}
    .titleValue{ font-size: 14px;}
    &.center{
      .subindicator{ text-align: center; display: inline-block; }
    }
    &.subindicator-center{
      >div{ display: block; text-align: center;}
    }

    .subindicator{ text-align: left;
      padding:10px;
    }
    .subindicator-center{ display: inline-block; margin: 0 auto;}
    >div{ border-radius: 6px;}
    .titleName{ font-size: 12px;}
    .titleValue{ font-size: 14px;}
  }
</style>
