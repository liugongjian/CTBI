<template>
  <div class="tab-pane-content">
    <div class="data-panel-field-wrapper">
      <div class="areas-wrapper">
        <div
          v-for="(item,name,index) in option.dataSource"
          :key="index"
          class="field-area-wrapper"
          @dragover="hanldDragOver"
          @drop.stop="handleTargetDrop($event,name,item,item.name)"
        >
          <div class="field-area-header">
            <span v-if="isRequired(item)">*</span>
            <div class="area-name">{{ item.name }}</div>
          </div>
          <div>
            <div class="field-area-body">
              <div v-show="item.value && item.value.length>0">
                <div
                  v-for="(el,i) in item.value"
                  :key="i"
                  class="field-box-wrapper"
                >
                  <div
                    :class="name==='Dimension'?'dimension-field-box':'measure-field-box'"
                    class="base-field-box"
                  >
                    <svg-icon v-if="name==='Dimension'" icon-class="dimension" />
                    <svg-icon v-else icon-class="measure" />
                    <span class="field-caption">{{ el.displayColumn }}</span>
                    <div class="right-hover-icons">
                      <span
                        style="cursor:pointer;marign-left:3px;"
                        @click="hanldDelete(item,el)"
                      >
                        <i class="el-icon-delete" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-show="!item.value||item.value.length===0"
                class="blank-area-tip"
                title="拖动数据字段到此处"
              >拖动数据字段到此处</div>
            </div>
          </div>
        </div>
      </div>
      <div class="update-wrapper">
        <div class="auto-refresh-wrapper">
          <el-checkbox
            v-model="autoRefresh"
            label="自动刷新"
            @change="handleRefresh"
          />
          <input
            v-if="autoRefresh"
            v-model="time"
            type="number"
            class="limit-input"
          >
          <el-select
            v-if="autoRefresh"
            v-model="unit"
            popper-class="setting-select"
            placeholder="请选择"
            @change="selectUnit"
          >
            <el-option
              v-for="item in unitOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="result-display">
          <span class="m-r-8">结果展示</span>
          <div>
            <input
              v-model="limit"
              type="number"
              class="limit-input"
            >
          </div>
        </div>
        <el-button
          type="primary"
          @click="reflashStore"
        >更新</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getDataSetData } from '@/api/dataSet'
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'DataPanelField',
  props: {
    identify: {
      type: String,
      default: ''
    },
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dataValue: [],
      limit: 100, // 结果展示条数
      autoRefresh: false, // 自动刷新
      unitOption: [{
        value: 'minute',
        label: '分'
      }, {
        value: 'second',
        label: '秒'
      }],
      time: 10,
      unit: 'minute',
      interVal: null
    }
  },
  watch: {
    time: {
      handler (val) {
        if (this.autoRefresh) {
          // 开启自动刷新的定时器
          const time = 1000 * val * (this.unit === 'minute' ? 60 : 1)
          this.interVal = setInterval(() => {
            this.reflashStore()
          }, time)
        } else {
          clearInterval(this.interVal)
          this.interVal = null
        }
      },
      deep: true
    }
  },
  mounted () {
    // const dataValue = [
    //   ['product', '2015', '2016', '2017'],
    //   ['Matcha Latte', 43.3, 85.8, 93.7],
    //   ['Matcha Latte11', 13.3, 85.8, 93.7],
    //   ['Milk Tea1', 13.1, 73.4, 55.1],
    //   ['Milk Tea2', 3.1, 73.4, 55.1],
    //   ['Milk Tea6', 83.1, 73.4, 55.1],
    //   ['Cheese Cocoa', 86.4, 65.2, 82.5],
    //   ['Walnut Brownie', 72.4, 53.9, 39.1],
    //   ['Tea', 22.1, 73.4, 55.1]
    // ]
    // 明细表
    // const dataValue = {
    //   tableData: [{
    //     date: '2016-05-02',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   }, {
    //     date: '2016-05-04',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1517 弄'
    //   }, {
    //     date: '2016-05-01',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1519 弄'
    //   }, {
    //     date: '2016-05-03',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1516 弄'
    //   }],
    //   total: 4,
    //   columns: [{
    //     prop: 'date',
    //     label: '日期'
    //   }, {
    //     prop: 'name',
    //     label: '姓名'
    //   }, {
    //     prop: 'address',
    //     label: '地址'
    //   }]
    // }
    // 雷达图
    // const dataValue = [
    //   ['实际支出', [5000, 14000, 28000, 26000, 42000, 21000]],
    //   ['分配预算', [4200, 3000, 20000, 35000, 50000, 18000]]
    // ]
    // 进度条
    // 词云数据
    // const dataValue = [
    //   { name: 'Sam S Club', value: 10000 }, { name: 'Macys', value: 6181 },
    //   { name: 'Amy Schumer', value: 4386 }, { name: 'Jurassic World', value: 4055 },
    //   { name: 'Charter Communications', value: 2467 }, { name: 'Chick Fil A', value: 2244 },
    //   { name: 'Planet Fitness', value: 1898 }, { name: 'Pitch Perfect', value: 1484 },
    //   { name: 'Express', value: 1112 }, { name: 'Home', value: 965 },
    //   { name: 'Johnny Depp', value: 847 }, { name: 'Lena Dunham', value: 582 },
    //   { name: 'Lewis Hamilton', value: 555 }, { name: 'KXAN', value: 550 },
    //   { name: 'Mary Ellen Mark', value: 462 }, { name: 'Farrah Abraham', value: 366 },
    //   { name: 'Rita Ora', value: 360 }, { name: 'Serena Williams', value: 282 },
    //   { name: 'NCAA baseball tournament', value: 273 }, { name: 'Point Break', value: 265 }
    // ]
    // 看板
    // const dataValue = [
    //   {
    //     'name': '东北',
    //     data: [
    //       { title: '单价', value: '4.45万' },
    //       { title: '利润金额', value: '4.45万' }
    //     ]
    //   }, {
    //     'name': '华东',
    //     data: [
    //       { title: '单价', value: '4.45万' },
    //       { title: '利润金额', value: '4.45万' }
    //     ]
    //   }, {
    //     'name': '华北',
    //     data: [
    //       { title: '单价', value: '4.45万' },
    //       { title: '利润金额', value: '4.45万' }
    //     ]
    //   }, {
    //     'name': '华南',
    //     data: [
    //       { title: '单价', value: '4.45万' },
    //       { title: '利润金额', value: '4.45万' }
    //     ]
    //   }
    // ]
  },
  beforeDestroy() {
    clearInterval(this.interVal)
    this.interVal = null
  },
  methods: {
    // 判断是否必填
    isRequired(val) {
      if (val.name.indexOf('主值轴') > -1) {
        return false
      }
      if (val.name.indexOf('副值轴') > -1) {
        return false
      }
      return true
    },
    // 当拖拽在当前元素上时
    hanldDragOver (e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    // 拖拽结束
    handleTargetDrop (e, name, item, itemName) {
      const data = JSON.parse(e.dataTransfer.getData('data'))
      // 判断拖拽元素是否在对应元素上 副值轴 name是Measure1 data.type是Measure
      if (name.indexOf(data.type) > -1) {
        // 判断是否已经存在
        const dataIndex = item.value.findIndex(el => {
          return el._id === data._id
        })
        if (dataIndex !== -1) {
          this.$message({
            message: `已存在该对象 ${data.displayColumn}`,
            type: 'warning'
          })
        } else {
          item.value.push(data)
        }
      } else {
        const dataName = data.type === 'Measure' ? '度量' : '维度'
        this.$message({
          message: `不支持添加${dataName}到[${itemName}]上`,
          type: 'warning'
        })
      }
    },
    // 删除字段
    hanldDelete (item, el) {
      const dataIndex = item.value.findIndex(ele => {
        return ele._id === el._id
      })
      item.value.splice(dataIndex, 1)
    },
    // 自动刷新
    handleRefresh (val) {
      if (val) {
        // 开启自动刷新的定时器
        const time = 1000 * this.time * (this.unit === 'minute' ? 60 : 1)
        this.interVal = setInterval(() => {
          this.reflashStore()
        }, time)
      } else {
        clearInterval(this.interVal)
        this.interVal = null
      }
    },
    selectUnit(val) {
      if (this.autoRefresh) {
        // 开启自动刷新的定时器
        const time = 1000 * this.time * (val === 'minute' ? 60 : 1)
        this.interVal = setInterval(() => {
          this.reflashStore()
        }, time)
      } else {
        clearInterval(this.interVal)
        this.interVal = null
      }
    },
    // 更新
    async reflashStore () {
      const dataSource = deepClone(this.option.dataSource)
      this.dataValue = []
      // 如果有主值轴和副值轴 那么两者一者有值即可
      if (dataSource['Measure'].value.length === 0 && dataSource['Measure1'].value.length === 0) {
        this.$message({
          message: `主值轴/副值轴区域缺少度量项`,
          type: 'error'
        })
        return
      }
      for (const i in dataSource) {
        if (dataSource[i].value.length === 0 && dataSource[i].name.indexOf('主值轴') < 0 && dataSource[i].name.indexOf('副值轴') < 0) {
          this.$message({
            message: `${dataSource[i].name}缺少必填字段`,
            type: 'error'
          })
          return
        }
        for (let j = 0; j < dataSource[i].value.length; j++) {
          if (dataSource[i]['name'] === '副值轴/度量') {
            await this.getData(dataSource[i]['value'][j], true)
          } else {
            await this.getData(dataSource[i]['value'][j], false)
          }
        }
      }
      const data = store.state.app.dataOption.find(item => {
        return item.i === this.identify
      })
      // 判断是否已经存在
      const val = deepClone(this.dataValue)
      if (data) {
        data.dataValue = val// 更新数据
      } else {
        store.state.app.dataOption.push({
          dataValue: val,
          i: this.identify
        })
      }
    },

    // 获取详细数据
    async getData (item, isMeasure1) {
      try {
        const body = {
          limit: this.limit,
          selectFields: [{ displayColumn: item.displayColumn }]
        }
        const res = await getDataSetData(item.dataSetID, body)
        this.dataValue.push({ isMeasure1, ...res })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
