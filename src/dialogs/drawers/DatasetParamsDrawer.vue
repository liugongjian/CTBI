<template>
  <el-drawer
    title="参数配置"
    :before-close="handleCloseSettingParam"
    :wrapper-closable="false"
    :size="560"
    :visible.sync="dialogVisible"
  >
    <div class="set-param-drawer">
      <div class="set-param-drawer-main">
        <el-table
          :data="sqlVariablesTableData"
          header-row-class-name="m-table-header"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column
            prop="type"
            label="类型"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="name"
            label="变量名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            label="变量类型"
            width="120"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.dataType"
                placeholder="请选择"
              >
                <template v-if="scope.row.dataType" #prefix>
                  <svg-icon :icon-class="`data-type-option-${scope.row.dataType}`" />
                </template>
                <el-option
                  v-for="item in variableTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span
                    class="data-type-option"
                  ><svg-icon
                    :icon-class="`data-type-option-${item.value}`"
                  /><span class="label">{{ item.label }}</span></span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="查询默认值"
            width="360"
          >
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
                  v-model="scope.row.defaultValue"
                  style="margin-left: 8px"
                  placeholder="请输入内容"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80"
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
          @click="close(sqlVariablesTableData)"
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
          value: 'date',
          label: '日期'
        }
      ],
      tableHeight: 'calc(100vh - 200px)',
      // 当前输入的sql脚本
      sql: '',
      // 回显表格数据，可由调用者传入
      sqlVariablesTableData: []
    }
  },
  mounted () {
    this.getVariables()
  },
  methods: {
    handleCloseSettingParam (done) {
      this.$confirm('确认关闭？选择离开本次编辑将不会保存')
        .then(_ => {
          done()
        })
        .catch(_ => { })
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
      try {
        const data = await getSqlVariables(body)
        this.transformVariables(data)
        // this.sqlVariablesTableData = data.slice()
        // console.log(this.sqlVariablesTableData)
      } catch (error) {
        console.log(error)
      }
    },
    // 对数组对象的合并，有则复用回显数据
    transformVariables (data) {
      console.log(data, this.sqlVariablesTableData)
      if (data && data.length > 0 && this.sqlVariablesTableData.length > 0) {
        data.forEach(item => {
          this.sqlVariablesTableData.forEach(origin => {
            if (item.name === origin.name) {
              Object.assign(item, origin)
            }
          })
        })
      }
      this.sqlVariablesTableData = data
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

.el-select .el-input__prefix {
  left: 7px;
  line-height: 32px;
  font-size: 13px;
  .svg-icon {
    width: 20px;
  }
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
  background: #FEF5EE;
}

.el-select-dropdown__item.selected {
  .data-type-option {
    .label {
      color: #FA8334;
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
</style>
