<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 10:26:53
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-03 16:31:03
 * @Description: 翻牌器
-->
<template>
  <div style="width: 100%; height: 100%">
    <div
      v-if="dataValue.length>0"
      class="count-wrap"
    >
      <div
        class="count-box"
        :style="getPosition"
      >
        <div
          class="count-name"
          :style="getMeasure"
        >
          <div
            v-show="storeOption.theme.StyleConfig.IndicatorPic.check"
            class="round"
            :style="getRound(dataValue[0].title)"
          >
            <ImgIcon :data="getSvgIcon(dataValue[0].title)" />
          </div>
          {{ dataValue[0].title }}
        </div>
        <div
          class="count-content"
          :style="getContent"
        >
          <span
            class="prefix"
            :style="getPrefixOrSuffix"
          >{{ getPrefix(dataValue[0]) }}</span>
          <CountTo
            :start-val="startVal"
            :end-val="Number(dataValue[0].value)"
            :duration="2500"
            class="count-number"
          />
          <span
            class="suffix"
            :style="getPrefixOrSuffix"
          >{{ getSuffix(dataValue[0]) }}</span>
        </div>
      </div>
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-count-up"
      style="width:100%;height:100%;"
    />
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getLayoutOptionById } from '@/utils/optionUtils'
import countupMixins from '@/components/Dashboard/mixins/countupMixins'
import store from '@/store'
import ImgIcon from '@/components/Dashboard/Common/ImgIcon'
export default {
  name: 'CountUpChart',
  components: {
    CountTo, ImgIcon
  },
  mixins: [countupMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataOption: [],
      dataValue: [
      ],
      startVal: 0
    }
  },
  computed: {
    getPrefix () {
      const { IndicatorSeries } = this.storeOption.theme.SeriesSetting
      return function ({ title, value }) {
        return IndicatorSeries.dataSeries?.find(item => item.title === title)?.prefix || ''
      }
    },
    getSuffix () {
      const { IndicatorSeries } = this.storeOption.theme.SeriesSetting
      return function ({ title, value }) {
        return IndicatorSeries.dataSeries?.find(item => item.title === title)?.suffix || ''
      }
    },
    // 指标块内位置
    getPosition () {
      const { position, align } = this.storeOption.theme.StyleConfig.IndicatorPosition
      const data = {}
      if (position === 'left') {
        data['align-self'] = 'baseline'
      } else {
        data['align-self'] = position
        data.margin = '0 auto'
        data['text-align'] = align
      }
      return data
    },
    getSvgIcon () {
      const { setSvg } = this.storeOption.theme.StyleConfig.IndicatorPic
      return function (name) {
        return setSvg?.find(item => item.name === name)?.svg
      }
    },
    // 度量值title前面的图片的样式
    getRound () {
      const { color } = this.storeOption.theme.StyleConfig.IndicatorPic.Color
      const { fontSize } = this.storeOption.theme.StyleConfig.FontStyle.data[0] || {}
      return function (name) {
        return { 'background-color': color?.find(item => item.name === name)?.color, 'border-color': color?.find(item => item.name === name)?.color, 'width': fontSize * 2 + 'px', 'height': fontSize * 2 + 'px' }
      }
    },
    // 度量值title的字体样式
    getMeasure () {
      const { color, fontSize } = this.storeOption.theme.StyleConfig.FontStyle.data[0] || {}
      return {
        color,
        fontSize: `${fontSize}px`
      }
    },
    // 度量值vaule的字体样式
    getContent () {
      const { color, fontSize } = this.storeOption.theme.StyleConfig.FontStyle.data[1] || {}
      return {
        color,
        fontSize: `${fontSize}px`
      }
    },
    // 度量值vaule 前缀或者后缀的字体样式
    getPrefixOrSuffix () {
      const { fontSize } = this.storeOption.theme.StyleConfig.FontStyle.data[0] || {}
      return {
        fontSize: `${fontSize / 2}px`
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    getOption () {
      console.log('datavale', this.dataValue)
      console.log('????')
    }
  }
}
</script>

<style scoped>
.count-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: auto;
}
.count-box {
  max-width: 100%;
}
.count-name {
  display: flex;
  align-items: center;
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
