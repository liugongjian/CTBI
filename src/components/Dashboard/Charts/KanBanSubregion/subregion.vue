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
        <div v-for="(subItem, i) in item.data" :key="i" class="measure">
          <!-- 主副 第一个指标-->
          <template v-if="i === 0 && option.IndicatorDisplay.relation === 'deputy'">
            <div class="flex-align-center">
              <span v-show="!item.name&&option.IndicatorPic.check" class="round" :style="getRound(subItem.title)">
                <ImgIcon :data="getSvgIcon(subItem.title)" />
              </span>
            </div>
            <span v-show="option.IndicatorDisplay.indicators" :style="getMainTarget">{{ subItem.title }}</span>

            <div class="flex-align-center">
              <span style="fontSize: 12px">{{ getPrefix(subItem) }}</span>
              <span :style="getTargetVal">{{ getSeries(subItem) }}</span>
              <span style="fontSize: 12px">{{ getSuffix(subItem) }}</span>
            </div>
          </template>
          <!-- 主副 大于第一个的指标-->
          <template v-if="i > 0 && option.IndicatorDisplay.relation === 'deputy'">
            <span :style="getSecTarget">{{ subItem.title }}</span>
            <div class="flex-align-center">
              <span style="fontSize: 12px">{{ getPrefix(subItem) }}</span>
              <span :style="getSecTargetVal">{{ getSeries(subItem) }}</span>
              <span style="fontSize: 12px">{{ getSuffix(subItem) }}</span>
            </div>
          </template>
          <!-- 并列 -->
          <template v-if="option.IndicatorDisplay.relation !== 'deputy'">
            <span v-show="option.IndicatorPic.check" class="round" :style="getRound(subItem.title)">
              <ImgIcon :data="getSvgIcon(subItem.title)" />
            </span>
            <span :style="getTarget">{{ subItem.title }}</span>
            <div class="flex-align-center">
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
    }
  },
  computed: {
    getSeries() {
      return function({ value }) {
        return `${value}`
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
      const data = {}
      if (this.option.IndicatorPosition.position === 'left') {
        data.float = 'left'
      } else {
        data.margin = '0 auto'
        data['text-align'] = this.option.IndicatorPosition.align
      }
      return data
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
        width: this.option.IndicatorDisplay.relation === 'deputy' ? '100%' : '',
        textAlign: 'left',
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
      return {
        width: this.option.IndicatorDisplay.moreRelation === 'line' ? '' : `${(1 / this.option.IndicatorDisplay.lineNum * 100).toFixed(0)}%`
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
    // min-width: 160px;
    border-bottom: 1px solid #e5e5e5;
  }
  .item {
    padding: 5px;
    padding-bottom: 5px;
    margin: 5px;
    // width: 150px;
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
    flex-wrap: wrap;
    background-color: #fff;
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
