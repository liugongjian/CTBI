<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue" class="kbs-wrap">
      <ul>
        <li v-for="(v, i) in dataValue.mainData" :key="i">{{ v }}</li>
      </ul>
      <p>{{ dataValue.secondaryData.title }} {{ dataValue.secondaryData.value }}</p>
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
export default {
  name: 'KanBanSummary',
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
      dataValue: {
        'time': '201304',
        mainData: {
          'title': '利润金额',
          'value': '1.558万'
        },
        secondaryData: {
          'title': '利润金额_月环比',
          'value': '-42.31%'
        }
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {}
  }
}
</script>

<style scoped>
.kbs-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
ul > li {
  list-style: none;
  text-align: center;
}
ul li:nth-child(2) {
  font-size: 24px;
}
</style>

