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
                    :class="name==='dimension'?'dimension-field-box':'measure-field-box'"
                    class="base-field-box"
                  >
                    <span class="field-caption">{{ el.label }}</span>
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
      <el-input
        v-model="val"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
      <el-button
        type="primary"
        @click="reflashStore"
      >更新</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
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
      val: ''
    }
  },
  mounted () {
    const dataValue = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Matcha Latte11', 13.3, 85.8, 93.7],
      ['Milk Tea1', 13.1, 73.4, 55.1],
      ['Milk Tea2', 3.1, 73.4, 55.1],
      ['Milk Tea6', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1],
      ['Tea', 22.1, 73.4, 55.1]
    ]
    // 主轴-0标记 副轴-1标记 组合图专用数据
    // const dataValue = [
    //   ['date', '价格-0', '数量-0', '温度-1'],
    //   ['Mon', 820, 410, 36],
    //   ['Tue', 932, 320, 36.3],
    //   ['Wed', 901, 300, 36.6],
    //   ['Thu', 934, 380, 34],
    //   ['Fri', 1290, 430, 39.6],
    //   ['Sat', 1330, 480, 37.6],
    //   ['Sun', 1320, 460, 38]
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
    // 柱图、折线图
    // const dataValue = [
    //   ['date', '价格', '数量', '温度'],
    //   ['Mon', 820, 410, 36],
    //   ['Tue', 932, 320, 36.3],
    //   ['Wed', 901, 300, 36.6],
    //   ['Thu', 934, 380, undefined],
    //   ['Fri', 1290, 430, 39.6],
    //   ['Sat', 1330, 480, 37.6],
    //   ['Sun', 1320, 460, 38]
    // ]
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
    this.val = JSON.stringify(dataValue)
  },
  methods: {
    // 当拖拽在当前元素上时
    hanldDragOver (e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    // 拖拽结束
    handleTargetDrop (e, name, item, itemName) {
      const data = JSON.parse(e.dataTransfer.getData('data'))
      // 判断拖拽元素是否在对应元素上
      if (data.type === name) {
        // 判断是否已经存在
        const dataIndex = item.value.findIndex(el => {
          return el.id === data.id
        })
        if (dataIndex !== -1) {
          this.$message({
            message: `已存在该对象 ${data.label}`,
            type: 'warning'
          })
        } else {
          item.value.push(data)
        }
      } else {
        const dataName = data.type === 'measure' ? '度量' : '维度'
        this.$message({
          message: `不支持添加${dataName}到[${itemName}]上`,
          type: 'warning'
        })
      }
    },
    // 删除字段
    hanldDelete (item, el) {
      const dataIndex = item.value.findIndex(ele => {
        return ele.id === el.id
      })
      item.value.splice(dataIndex, 1)
    },
    // 更新
    reflashStore () {
      const data = store.state.app.dataOption.find(item => {
        return item.i === this.identify
      })
      // 判断是否已经存在
      if (data) {
        data.dataValue = JSON.parse(this.val)// 更新数据
      } else {
        store.state.app.dataOption.push({
          dataValue: JSON.parse(this.val),
          i: this.identify
        })
      }
    }
  }
}
</script>

<style>
</style>
