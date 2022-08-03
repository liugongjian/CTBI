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
    <div
      style="margin:10px;"
      :style="[
        {
          backgroundColor:trendChartConfig.open&&isSelect&&trendChartConfig.type == 'disperse'?titleItem.color:!trendChartConfig.open?'':trendChartConfig.type==='disperse'?'#F5F5F5':''}
      ]"
    >
      <div class="subindicator" :class="{'subindicator-center' : trendStyleConfig.align == 'center'}">
        <div
          class="titleName"
          :style="[
            {color:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].color :'#333' },
            {fontSize:trendStyleConfig.style?trendStyleConfig.fontSizeStyle[0].size+'px' :'' }
          ]"
        >{{ titleItem.name }}</div>
        <div
          class="titleValue"
          :style="[
            {color:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].color :'#333' },
            {fontSize:trendChartConfig.open&&trendStyleConfig.style?trendStyleConfig.fontSizeStyle[1].size+'px' :'' }
          ]"
        >{{ titleItem.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { boolean } from 'yargs'

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
      type: boolean,
      default: () => true
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
