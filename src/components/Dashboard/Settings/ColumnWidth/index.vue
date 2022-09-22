<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-15 17:54:49
 * @Description:
-->
<template>
  <div v-if="visible" class="editor-object-container">
    <span class="editor-item-title">列宽调整</span>
    <el-radio-group v-model="option.type">
      <el-radio label="selfadapting">按容器自适应</el-radio>
      <el-radio label="selfdefine">自定义</el-radio>
    </el-radio-group>
    <div v-if="option.type === 'selfdefine'" class="item">
      <div v-for="(item, index) in dimensionArrTemp" :key="index" class="m-t-8 box">
        <span>{{ item.displayColumn }}</span>
        <el-checkbox v-model="item.auto" style="margin-left: 5px" @change="handleAuto(item.displayColumn, item.auto)">自动</el-checkbox>
        <div v-show="!item.auto">
          <input
            v-model="item.width"
            type="number"
            class="limit-input"
          >
          <span style="margin-left: 5px">px</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Edition from '@/components/Dashboard/mixins/EditionMixins'
export default {
  name: 'ColumnWidth',
  mixins: [Edition],
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dimensionArrTemp: []
    }
  },
  computed: {
    dimensionArr: {
      get() {
        const temp = []
        store.state.app.layout.forEach(item => {
          if (item.id === store.state.app.currentLayoutId) {
            if (item.option.dataSource.DimensionOrMeasure.value) {
              item.option.dataSource.DimensionOrMeasure.value.forEach(j => {
                if (j.type === 'Dimension') {
                  temp.push({ displayColumn: j.displayColumn, width: 0, auto: true })
                }
              })
            }
          }
        })
        return temp
      },
      set(val) {
        this.dimensionArrTemp = val
      }
    }
  },
  mounted() {
    this.dimensionArrTemp = this.dimensionArr
  },
  methods: {
    handleAuto(val, boolean) {
      this.$nextTick(() => {
        this.dimensionArrTemp = this.dimensionArr.map((item) => {
          if (item.displayColumn === val) {
            item.auto = boolean
          }
          return item
        })

        this.option.dimensionArr = this.dimensionArrTemp
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  padding: 0 5px 5px 5px;
  background-color: #434a59;
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  font-weight: 500;
  .box{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .limit-input {
    box-sizing: border-box;
    background: rgba(0, 0, 0, .1);
    color: #fff;
    padding: 0 8px;
    width: 60px;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 2px;
}
}
</style>
