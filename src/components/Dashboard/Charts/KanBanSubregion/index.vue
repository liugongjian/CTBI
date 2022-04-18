<template>
  <div style="width: 100%; height: 100%">
    <div v-if="dataValue" class="kbs-wrap">
      <el-row>
        <el-col :span="12" class="kbs-item">
          <ul>
            <li v-for="(v,i) in dataValue.area_1" :key="i+v">{{ v }}</li>
          </ul>
        </el-col>
        <el-col :span="12" class="kbs-item">
          <ul>
            <li v-for="(v,i) in dataValue.area_2" :key="i+v">{{ v }}</li>
          </ul>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="kbs-item">
          <ul>
            <li v-for="(v,i) in dataValue.area_3" :key="i+v">{{ v }}</li>
          </ul>
        </el-col>
        <el-col :span="12" class="kbs-item">
          <ul>
            <li v-for="(v,i) in dataValue.area_4" :key="i+v">{{ v }}</li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
export default {
  name: 'KanBanSubregion',
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
        area_1: {
          'name': '东北',
          'title': '利润金额',
          'value': '5.764万'
        },
        area_2: {
          'name': '华东',
          'title': '利润金额',
          'value': '8.049万'
        },
        area_3: {
          'name': '华北',
          'title': '利润金额',
          'value': '14.76万'
        },
        area_4: {
          'name': '华南',
          'title': '利润金额',
          'value': '17.33万'
        }
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
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
}
.kbs-item {
  padding: 10px 40px;
}

ul > li {
  list-style: none;
  text-align: center;
}
ul li:nth-child(3) {
  font-size: 24px;
}
</style>
