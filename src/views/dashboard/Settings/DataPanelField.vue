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
            <el-tooltip
              v-if="item.tooltip"
              effect="dark"
              :content="item.tooltip"
              placement="top"
            >
              <i class="el-icon-warning-outline" />
            </el-tooltip>
            <div v-if="item.limit">
              {{ item.value.length }}/{{ item.limit }}
            </div>
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
                    :class="el.type==='Dimension'?'dimension-field-box':'measure-field-box'"
                    class="base-field-box"
                  >
                    <svg-icon
                      style="width: 20px;height: 18px;margin-right: 2px;position: relative;top: 2px;"
                      :icon-class="typeTransform(el.attributes)"
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
          <el-input-number
            v-show="autoRefresh"
            v-model="time"
            :min="1"
            :precision="0"
            :max="refreshMax"
            :controls="false"
            class="limit-input"
            @input="handleRefresh"
          />
          <el-select
            v-show="autoRefresh"
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
import { deepClone, transformDataTypeIcon } from '@/utils/optionUtils'
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
      unit: 'second',
      interVal: null
    }
  },
  computed: {
    refreshMax () {
      if (this.unit === 'minute') {
        return 1440
      }
      return 60
    }
  },
  beforeDestroy () {
    clearInterval(this.interVal)
    this.interVal = null
  },
  methods: {
    typeTransform (data) {
      return transformDataTypeIcon(data)
    },
    // 当拖拽在当前元素上时
    handleDragOver (e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    // 拖拽结束
    /**
     * @param(String) name 当前元素
     * @param(Object) item 组件配置项dataSource中的对象
     * @param(String) itemName
     */
    handleTargetDrop (e, name, item, itemName) {
      const data = JSON.parse(e.dataTransfer.getData('data'))
      // 判断拖拽元素是否在对应元素上 副值轴 name是Measure1 data.type是Measure
      if (name.indexOf(data.type) > -1) {
        // 判断是否已经存在
        const dataIndex = item.value.findIndex(el => {
          return el._id === data._id
        })
        if (dataIndex !== -1) {
          this.$message.warning(`已存在该对象 ${data.displayColumn}`)
        } else {
          // 限制数量
          if (item.limit) {
            if (item.value.length === item.limit) {
              this.$message.warning(`已超过[${itemName}]最多可添加项数量（${item.limit}）`)
              return
            }
          }

          // 自定义校验
          if (item.validate && typeof item.validate === 'function') {
            const { success, msg } = item.validate(data)
            if (!success) {
              this.$message.warning(msg)
              return
            }
          }

          item.value.push(data)
        }
      } else {
        if (data.type !== 'DimensionOrMeasure') {
          const dataName = data.type === 'Measure' ? '度量' : '维度'
          this.$message.warning(`不支持添加${dataName}到[${itemName}]上`)
        }
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
      if (this.autoRefresh) {
        if (this.interVal) {
          clearInterval(this.interVal)
          this.interVal = null
        }

        if (val) {
          // 开启自动刷新的定时器
          const time = 1000 * this.time * (this.unit === 'minute' ? 60 : 1)
          this.interVal = setInterval(() => {
            this.refreshStore()
          }, time)
        }
      }
    },
    selectUnit (val) {
      // 切换单位时判断当前是否超出单位上限值
      let max = 60
      if (val === 'minute') {
        max = 1440
      }
      if (this.time > max) {
        this.time = max
      }

      if (this.interVal) {
        clearInterval(this.interVal)
        this.interVal = null
      }

      if (this.autoRefresh) {
        // 开启自动刷新的定时器
        const time = 1000 * this.time * (val === 'minute' ? 60 : 1)
        this.interVal = setInterval(() => {
          this.refreshStore()
        }, time)
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
