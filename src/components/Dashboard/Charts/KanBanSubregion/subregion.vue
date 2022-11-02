<template>
  <div class="container" :style="getMoreRelation">
    <div v-for="(item,index) in data" :key="index" class="box" :style="getBox">
      <div class="item" :style="getItem">
        <!-- item.name不为空 则有维度 -->
        <div v-show="item.name&&option.IndicatorDisplay.dimension" class="flex-align-center" :style="getDimension">
          <span v-show="option.IndicatorPic.check" class="round" :style="getRound(item.name)">
            <ImgIcon :data="getSvgIcon(item.name)" />
          </span>
          {{ item.name }}
        </div>
        <!-- 主副 第一个指标-->
        <template v-if="option.IndicatorDisplay.relation === 'deputy'">
          <span v-show="option.IndicatorDisplay.indicators" :style="getMainTarget">{{ item.data[0].title }}</span>

          <div class="flex-align-center">
            <span style="fontSize: 12px">{{ getPrefix(item.data[0]) }}</span>
            <span :style="getTargetVal">{{ getSeries(item.data[0]) }}</span>
            <span style="fontSize: 12px">{{ getSuffix(item.data[0]) }}</span>
          </div>
        </template>
        <div v-for="(subItem, i) in item.data" :key="i" class="measure">
          <!-- 主副 大于第一个的指标-->
          <template v-if="i > 0 && option.IndicatorDisplay.relation === 'deputy'">
            <div :style="getSecTarget">{{ subItem.title }}</div>
            <div class="flex-align-center" style="padding-left: 10px">
              <span style="fontSize: 12px">{{ getPrefix(subItem) }}</span>
              <span :style="getSecTargetVal">{{ getSeries(subItem) }}</span>
              <span style="fontSize: 12px">{{ getSuffix(subItem) }}</span>
            </div>
          </template>
          <!-- 并列 -->
          <template v-if="option.IndicatorDisplay.relation !== 'deputy'">
            <div v-show="option.IndicatorDisplay.indicators" :style="getTarget">{{ subItem.title }}</div>
            <div class="flex-align-center" style="padding-left: 10px">
              <span style="fontSize: 12px">{{ getPrefix(subItem) }}</span>
              <span :style="getTargetVal" class="num">{{ getSeries(subItem) }}</span>
              <span style="fontSize: 12px">{{ getSuffix(subItem) }}</span>
            </div>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ImgIcon from '@/components/Dashboard/Common/ImgIcon'
import { numToFixed } from '@/utils/numberUtils'
export default {
  name: 'Subregion',
  components: {
    ImgIcon
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    option: {
      type: Object,
      default: () => ({})
    },
    series: {
      type: Object,
      default: () => ({})
    },
    layout: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getSeries() {
      return function({ value }) {
        return `${numToFixed(value, 3)}`
      }
    },
    getPrefix() {
      return function({ title }) {
        return this.series.dataSeries?.find(item => item.title === title)?.prefix || ''
      }
    },
    getSuffix() {
      return function({ title }) {
        return this.series.dataSeries?.find(item => item.title === title)?.suffix || ''
      }
    },
    getSvgIcon () {
      return function(name) {
        return this.option.IndicatorPic.setSvg?.find(item => item.name === name)?.svg
      }
    },
    getRound() {
      const { fontSize } = this.option.FontStyle.data[0] || {}
      return function(name) {
        return { 'background-color': this.option.IndicatorPic.Color.color?.find(item => item.name === name)?.color, 'border-color': this.option.IndicatorPic.Color.color?.find(item => item.name === name)?.color, 'width': fontSize * 2 + 'px', 'height': fontSize * 2 + 'px' }
      }
    },
    getItem() {
      return {
        'align-items': this.option.IndicatorPosition.position === 'center' && this.option.IndicatorPosition.align === 'center' ? 'center' : 'flex-start'
      }
    },
    getTargetVal() {
      const { valColor, valFontSize } = this.option.FontStyle?.target || {}
      return {
        color: valColor,
        fontSize: `${valFontSize}px`
      }
    },
    getTarget() {
      const { nameColor, nameFontSize } = this.option.FontStyle?.target || {}
      return {
        color: nameColor,
        fontSize: `${nameFontSize}px`
      }
    },
    getDimension() {
      const { color, fontSize } = this.option.FontStyle?.data[0] || {}
      return {
        color,
        fontSize: `${fontSize}px`
      }
    },
    getSecTargetVal() {
      const { fontSize } = this.option.FontStyle.secTarget
      const color = this.option.FontStyle.secTarget.valColor
      return {
        color,
        fontSize: `${fontSize}px`
      }
    },
    getMainTarget() {
      return {
        fontSize: `${this.option.FontStyle.target.nameFontSize}px`,
        color: this.option.FontStyle.target.nameColor
      }
    },
    getSecTarget() {
      return {
        // width: this.option.IndicatorDisplay.relation === 'deputy' ? '100%' : '',
        fontSize: `${this.option.FontStyle.secTarget.fontSize}px`,
        color: this.option.FontStyle.secTarget.nameColor
      }
    },
    getBox() {
      let finalWidth = '180px'
      if (this.option.IndicatorDisplay.moreRelation !== 'line') {
        const maxNum = this.option.IndicatorDisplay.lineNum || 4
        const containerWidth = (this.layout.width || 900) - 45
        const num = containerWidth / maxNum > 180 ? this.option.IndicatorDisplay.lineNum : parseInt(containerWidth / 180)
        finalWidth = `${(1 / num * 100).toFixed(0)}%`
      }
      return {
        'min-width': finalWidth,
        'justify-content': this.option.IndicatorPosition.position === 'left' ? 'flex-start' : 'center'
      }
    },
    getMoreRelation() {
      return {
        flexWrap: this.option.IndicatorDisplay.moreRelation === 'line' ? 'nowrap' : 'wrap'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .box {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    // min-width: 160px;
    border-bottom: 1px solid #e5e5e5;
    flex-basis: auto;
  }
  .item {
    padding: 5px;
    padding-bottom: 5px;
    margin: 5px;
    border: 0px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
    //min-width: 150px;
    &:before {
      content: '';
      position: absolute;
      left: -1px;
      bottom: 5px;
      display: inline-block;
      height: 90%;
      width: 1px;
      border-left: 1px solid #e5e5e5;
    }
  }
  .measure {
    display: flex;
    justify-content:space-between;
    width: 100%;
  }
}
.round {
  margin-right: 8px;
  background-color: aqua;
  border-color: aqua;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
