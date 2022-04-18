<template>
  <div>
    <div class="editor-object-container">
      <div>请选择系列</div>
      <el-select
        v-model="option.selectValue"
        placeholder="请选择"
        @focus="getEeriesOption"
        @change="selectSeries"
      >
        <el-option
          v-for="item in seriesOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="option.remarkShow" class="editor-object-container" style="display: flex;align-items: center">
      <span>别名</span>
      <el-input v-model="option.remark" @input="setRemark" />
    </div>
  </div>
</template>

<script>
import store from '@/store'
// import { getLayoutById, deepClone } from '@/utils/optionUtils'
// import { colorTheme } from '@/constants/color.js'
export default {
  name: 'SeriesSelect',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      seriesOption: []
    }
  },
  computed: {
  },
  watch: {
    seriesOption: {
      handler (val) {
        this.option.seriesOption = val
        this.option.selectValue = val[0]?.value
        if (!this.option.remark) {
          this.option.remark = val[0]?.label
        }
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    getEeriesOption () {
      // 获取系列名字集合
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          this.seriesOption = item.option.theme.SeriesSetting.SeriesSelect.seriesOption
        }
      })
    },
    // 选中某个系列名
    selectSeries () {
      this.option.remark = this.option.selectValue
    },
    // 改变选中的系列名字 即设置别名
    setRemark (val) {
      // 获取数据 dataSource
    //   store.state.app.layout.forEach(item => {
    //     if (item.i === store.state.app.currentLayoutId) {
    //       this.dataSource = item.option.dataSource
    //     }
    //   })
    //   this.dataSource.forEach(item => {
    //     if (item[0] === this.option.selectValue) {
    //       item[0] = val
    //     }
    //   })

    //   //   store.dispatch('app/updateLayoutItem', { id: this.identify, item: newTemp })
    //   console.log('......11', this.dataSource)
    //   store.state.app.layout.forEach(item => {
    //     if (item.i === store.state.app.currentLayoutId) {
    //       const newTemp = deepClone(item)
    //       newTemp.option.dataSource = this.dataSource
    //       //   this.storeOption = getLayoutOptionById(item.i)
    //       store.dispatch('app/updateLayoutItem', { id: item.i, item: newTemp })
    //       //   item.option.dataSource = this.dataSource
    //       console.log('...dada', newTemp)
    //     }
    //   })
    }
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px ;
}
</style>
