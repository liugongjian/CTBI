<template>
  <el-drawer
    :before-close="handleCloseSettingParam"
    :wrapper-closable="false"
    :size="630"
    :visible.sync="dialogVisible"
  >
    <template slot="title">
      <div>
        参数配置
        <el-tooltip
          effect="light"
          placement="right"
        >
          <div slot="content">参数：WHERE条件中添加${物理字段名:<br>参数变量名}；占位符：SQL中替换字符<br>${替换的字符}。在查询控件中可引用。</div>
          <i class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
    </template>
    <div class="set-param-drawer">
      <div class="set-param-drawer-main">
        <el-table
          v-loading="loading"
          :data="sqlVariablesTableData"
          :span-method="arraySpanMethod"
          row-class-name="no-border"
          header-row-class-name="m-table-header"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column
            prop="type"
            label="类型"
            width="80"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.type | extractTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="变量名"
            width="70"
            show-overflow-tooltip
          />
          <el-table-column
            label="变量类型"
            width="120"
          >
            <template slot-scope="scope">
              <el-cascader
                v-model="scope.row.fakeDataType"
                :options="variableTypeOptions"
                placeholder="请选择"
                :show-all-levels="false"
                @change="(value) => {handleCascaderChange(value, scope.row)}"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="查询默认值"
            width="260"
          >
            <template #header>
              <span>查询默认值</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="默认值生效范围支持“仅编辑页”和“全局生效”两种模式：仅编辑页-只在数据集编辑页生效，全局生效-在仪表板等下游也生效"
                placement="top"
              >
                <svg-icon
                  style="cursor:pointer"
                  icon-class="data-type-info"
                />
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div style="display: flex">
                <el-select
                  v-model="scope.row.useInGlobal"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in queryDefaultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-input
                  v-if="scope.row.fakeDataType && scope.row.fakeDataType[0] === 'text'"
                  v-model="scope.row.defaultValue"
                  class="default-value"
                  style="margin-left: 8px"
                  placeholder="请输入默认值"
                />
                <el-input-number
                  v-else-if="scope.row.fakeDataType && scope.row.fakeDataType[0] === 'number'"
                  v-model="scope.row.defaultValue"
                  class="default-value"
                  controls-position="right"
                  style="margin-left: 8px"
                  placeholder="请输入默认值"
                />
                <el-date-picker
                  v-else
                  v-model="scope.row.defaultValue"
                  class="default-value"
                  :format="scope.row.format"
                  :value-format="scope.row.format"
                  :type="scope.row.formatType"
                  style="margin-left: 8px"
                  placeholder="请输入默认值"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="50"
          >
            <template slot-scope="scope">
              <svg-icon
                icon-class="delete"
                style="cursor:pointer"
                @click="deleteSqlVariable(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="set-param-drawer-footer">
        <el-button
          pain
          @click="closeSilence"
        >取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleClose"
        >确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { getSqlVariables } from '@/api/dataSet'

export default {
  name: 'DatasetParamsDrawer',
  mixins: [dialogMixin],
  data () {
    return {
      queryDefaultOptions: [
        {
          value: false,
          label: '仅编辑页'
        },
        {
          value: true,
          label: '全局生效'
        }
      ],
      variableTypeOptions: [
        {
          value: 'number',
          label: '数字'
        },
        {
          value: 'text',
          label: '文本'
        },
        {
          value: 'year',
          label: '日期-年'
        },
        {
          value: 'month',
          label: '日期-年月',
          children: [{
            value: 'yyyy-MM',
            label: 'yyyy-MM'
          }, {
            value: 'yyyyMM',
            label: 'yyyyMM'
          }, {
            value: 'yyyy/MM',
            label: 'yyyy/MM'
          }]
        },
        {
          value: 'week',
          label: '日期-年周'
        },
        {
          value: 'date',
          label: '日期-年月日',
          children: [{
            value: 'yyyy-MM-dd',
            label: 'yyyy-MM-dd'
          }, {
            value: 'yyyyMMdd',
            label: 'yyyyMMdd'
          }, {
            value: 'yyyy/MM/dd',
            label: 'yyyy/MM/dd'
          }]
        },
        {
          value: 'datetime',
          label: '日期-年月日时分秒',
          children: [{
            value: 'yyyy-MM-dd HH:mm:ss',
            label: 'yyyy-MM-dd HH:mm:ss'
          }, {
            value: 'yyyyMMdd HH:mm:ss',
            label: 'yyyyMMdd HH:mm:ss'
          }, {
            value: 'yyyy/MM/dd HH:mm:ss',
            label: 'yyyy/MM/dd HH:mm:ss'
          }, {
            value: 'yyyyMMddHH:mm:ss',
            label: 'yyyyMMddHH:mm:ss'
          }]
        }
      ],
      tableHeight: 'calc(100vh - 200px)',
      // 当前输入的sql脚本
      sql: '',
      // 回显表格数据，可由调用者传入
      sqlVariablesTableData: [],
      loading: false
    }
  },
  mounted () {
    this.getVariables()
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row && row.separator) {
        return [1, 5]
      }
    },
    handleCloseSettingParam (done) {
      this.$confirm('确认关闭？选择离开本次编辑将不会保存')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleClose () {
      console.log(this.sqlVariablesTableData)
      this.close(this.sqlVariablesTableData.filter(item => { return !item.separator }))
    },
    // 删除
    deleteSqlVariable (val) {
      if (!val) return false
      let _idx = 0
      const tmp = this.sqlVariablesTableData.slice()
      tmp.forEach((item, idx) => {
        if (val.type === item.type && val.name === item.name) {
          _idx = idx
        }
      })
      tmp.splice(_idx, 1)
      this.sqlVariablesTableData = tmp.slice()
    },
    async getVariables () {
      if (!this.sql) {
        this.$message({
          message: '参数设置暂不支持空SQL语句',
          type: 'warning'
        })
        this.sqlVariablesTableData = []
      }
      const body = { sql: this.sql }
      this.loading = true
      try {
        const data = await getSqlVariables(body)
        this.transformVariables(data)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 对数组对象的合并，有则复用回显数据
    transformVariables (data) {
      let result = []
      if (data && data.length > 0) {
        // 如果当前字段的字段类型和查询默认值均为空，标识为新增参数
        // 已存在参数配置
        const originFields = []
        // 新增参数
        const newFields = []
        data.forEach(item => {
          const temp = this.sqlVariablesTableData.find(origin => {
            return item.name === origin.name
          })
          if (temp) {
            // 回显值封装
            if (!temp.fakeDataType) {
              const { dataType, format } = temp
              this.variableTypeOptions.forEach(option => {
                // 如果format有值，递归获取到具体数值并对fakeDataType赋值
                if (format) {
                  if (option.children) {
                    const opt = option.children.find(child => {
                      return child.value === format
                    })
                    if (opt) {
                      temp.fakeDataType = [option.value, format]
                      temp.formatType = option.value
                    }
                  }
                } else {
                  temp.fakeDataType = [dataType]
                }
              })
            }
            Object.assign(item, temp)
            originFields.push(item)
          } else if (!item.dataType && !item.useInGlobal) {
            item.dataType = 'text'
            item.fakeDataType = ['text']
            item.useInGlobal = false
            newFields.push(item)
          }
        })
        // 分隔符
        const separator = { separator: true, type: '———————— 以下为新增变量 ————————' }
        if (originFields && originFields.length > 0) {
          result = result.concat(originFields)
        }
        if (newFields && newFields.length > 0) {
          result.push(separator)
          result = result.concat(newFields)
        }
      }
      this.sqlVariablesTableData = result
    },
    handleCascaderChange (newValue, item) {
      if (newValue && newValue.length > 0) {
        item.defaultValue = ''
        const type = newValue[0]
        if (type !== 'text' && type !== 'number') {
          item.format = type === 'week' ? 'yyyy-WW' : newValue[1]
          item.formatType = type
          item.dataType = 'time'
        } else {
          item.dataType = type
        }
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.set-param-drawer {
  .set-param-drawer-main {
    padding: 15px 24px 24px;
    height: calc(100vh - 164px);
  }
  .set-param-drawer-footer {
    position: absolute;
    bottom: 0;
    padding: 9px 12px;
    text-align: center;
    background: #f5f5f5;
    width: 100%;
  }
}

::v-deep .el-select {
  width: 106px;
  .el-input__prefix {
    left: 7px;
    line-height: 32px;
    font-size: 13px;
    .svg-icon {
      width: 20px;
    }
  }
}
::v-deep .default-value.el-input {
  width: 140px;
}

.el-select-dropdown__item {
  padding: 0 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .data-type-option {
    .label {
      margin-left: 3px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
    }
    .svg-icon {
      width: 18px;
    }
  }
}
.el-select-dropdown__item.hover {
  background: #fef5ee;
}

.el-select-dropdown__item.selected {
  .data-type-option {
    .label {
      color: #fa8334;
    }
  }
}

::v-deep .m-table-header > th {
  background-color: #fafafa !important;
  color: rgba(0, 0, 0, 0.9);
}

::v-deep .el-drawer__header {
  border-bottom: 1px solid var(--gray-04, #d9d9d9);
  margin-bottom: 10px;
  padding: 17px 24px;
  height: 30px;
  font-size: 16px;
  font-weight: 500;
  font-family: PingFangSC-Medium, PingFang SC;
  color: rgba(0, 0, 0, 0.9);
}

::v-deep .no-border td {
  border-bottom-width: 0px !important;
}
</style>
