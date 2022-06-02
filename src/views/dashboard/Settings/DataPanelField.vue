<template>
  <div class="tab-pane-content">
    <div class="data-panel-field-wrapper">
      <div class="areas-wrapper">
        <div
          v-for="(item,name,index) in option.dataSource"
          :key="index"
          class="field-area-wrapper"
          @dragover="handleDragOver"
          @drop.stop="handleTargetDrop($event,name,item,item.name)"
        >
          <div class="field-area-header">
            <span v-if="item.require">*</span>
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
                    <svg-icon
                      v-if="name==='Dimension'"
                      icon-class="dimension"
                    />
                    <svg-icon
                      v-else
                      icon-class="measure"
                    />
                    <span class="field-caption">{{ el.displayColumn }}</span>
                    <div class="right-hover-icons">
                      <span
                        style="cursor:pointer;margin-left:3px;"
                        @click="handleDelete(item,el)"
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
          @click="refreshStore"
        >更新</el-button>
      </div>

    </div>
  </div>
</template>

<script>
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
            this.refreshStore()
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
  },
  beforeDestroy () {
    clearInterval(this.interVal)
    this.interVal = null
  },
  methods: {
    // 当拖拽在当前元素上时
    handleDragOver (e) {
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
    handleDelete (item, el) {
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
          this.refreshStore()
        }, time)
      } else {
        clearInterval(this.interVal)
        this.interVal = null
      }
    },
    selectUnit (val) {
      if (this.autoRefresh) {
        // 开启自动刷新的定时器
        const time = 1000 * this.time * (val === 'minute' ? 60 : 1)
        this.interVal = setInterval(() => {
          this.refreshStore()
        }, time)
      } else {
        clearInterval(this.interVal)
        this.interVal = null
      }
    },
    // 更新
    refreshStore () {
      const dataSource = deepClone(this.option.dataSource)
      for (const key in dataSource) {
        if (dataSource[key].value.length === 0 && dataSource[key].require) {
          this.$message({
            message: `${dataSource[key].name}缺少必填字段`,
            type: 'error'
          })
          return
        }
      }
      // 事件总线通知组件刷新数据
      this.$bus.$emit('interReload', [this.identify], this.limit)
    }

  }
}
</script>

<style>
</style>
