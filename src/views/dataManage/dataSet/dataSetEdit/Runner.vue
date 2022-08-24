<template>
  <div class="main-bar">
    <div class="main-preview bg-c-fff">
      <!-- 运行结果 & 历史记录 -->
      <div class="m-tab">
        <div
          :class="[{'active': activeTagName === 1}, 'tab-block']"
          @click="activeTagName = 1"
        >
          运行结果
        </div>
        <div
          :class="[{'active': activeTagName === 2}, 'tab-block']"
          @click="activeTagName = 2"
        >
          历史记录
        </div>
      </div>
      <div v-show="activeTagName === 1">
        <!-- 成功为table -->
        <template v-if="resultData.success">
          <!-- 未查询出数据时展示效果 -->
          <template v-if="!resultData.data || resultData.data.length === 0">
            <div style="text-align: center;margin-top: 38px;">
              <svg-icon
                style="width: 371px; height: 200px;"
                icon-class="sql-result-bg"
              />
              <div>
                <span class="result-bg-tip">编辑完代码后，点击上方运行按钮即可查看运</span>
              </div>
            </div>
          </template>
          <!-- 查询出数据时展示效果 -->
          <el-table
            v-else
            ref="refsTable"
            fit
            :height="tableHeight"
            header-row-class-name="m-table-header"
            row-class-name="m-table-row"
            :data="resultData.data"
          >
            <el-table-column
              label="序号"
              type="index"
              fixed
              min-width="50"
            />
            <el-table-column
              v-for="k in resultData.columns"
              :key="`table-column-${k.name}`"
              min-width="100"
              show-overflow-tooltip
              :prop="k.name"
              :label="k.name"
            />
          </el-table>
        </template>
        <!-- 失败 -->
        <template v-else>
          <div>
            <div class="error-msg-block">
              <div>报错详情</div>
              <div>{{ resultData.msg }}</div>
            </div>
            <div style="text-align: center;margin-top: 38px;">
              <svg-icon
                style="width: 371px; height: 200px;"
                icon-class="sql-result-err-bg"
              />
              <div>
                <span class="result-bg-tip">运行失败，SQL存在错误，请先修改代码</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-show="activeTagName === 2">
        <el-table
          v-if="historyLogTableData && historyLogTableData.length > 0"
          :height="tableHeight"
          :data="historyLogTableData"
          header-row-class-name="m-table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="createdTime"
            label="开始时间"
            min-width="180"
          />
          <el-table-column
            prop="sqlText"
            label="SQL语句"
            min-width="300"
          />
          <el-table-column
            prop="costTime"
            label="耗时（ms）"
            min-width="80"
          />
          <el-table-column
            prop="result"
            label="运行结果"
            min-width="80"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.result == 'success'">
                <el-badge
                  is-dot
                  style="top: 4px;margin-right: 6px;"
                  type="success"
                />
                <span>成功</span>
              </div>
              <div v-else>
                <el-badge
                  is-dot
                  style="top: 4px;margin-right: 6px;"
                  type="danger"
                />
                <span>失败</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                fixed="right"
                @click="copyHistoryLog(scope.row, $event)"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template v-else>
          <div style="text-align: center;margin-top: 38px;">
            <svg-icon
              style="width: 371px; height: 200px;"
              icon-class="sql-result-bg"
            />
            <div>
              <span class="result-bg-tip">未查询到历史记录</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from '@/utils/clipboard.js'

export default {
  props: {
    resultData: {
      type: Object,
      default: () => { }
    },
    historyLogTableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // tab标识 1：运行结果； 2：历史记录
      activeTagName: 1,
      // 表格高度 控制表格滚动区域
      tableHeight: 320
    }
  },
  methods: {
    setTableHeight (h) {
      if (h === '0px') return
      try {
        const height = Number.parseInt(h.replace('px'))
        this.tableHeight = height - 90
      } catch (err) {
        console.error('传入高度需为带px结尾的字符串')
      }
    },
    // 复制
    copyHistoryLog (val, event) {
      const str = val.sqlText
      Clipboard(str, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.main-bar {
  position: relative;

  .main-edit {
    height: 40%;
  }

  .main-preview {
    position: relative;
    padding: 16px;
    height: auto;

    .m-tab {
      border-bottom: 1px solid #dddddd;
      display: flex;
      margin-bottom: 16px;

      .tab-block {
        line-height: 20px;
        background-color: #f4f5f6;
        padding: 10px 22px;
        border: 1px solid #ddd;
        position: relative;
        top: 1px;
        border-bottom-width: 1px;
        color: rgba(0, 0, 0, 0.65);
        border-radius: 2px 2px 0px 0px;
        cursor: pointer;

        &:first-of-type {
          border-right-width: 0px;
        }

        &.active {
          background-color: #fff;
          border-bottom-color: #fff;
          color: #fa8334;
        }
      }
    }
  }
}

.result-bg-tip {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 20px;
}

.error-msg-block {
  border: 1px solid #ffa4a3;
  background-color: #ffecec;
  min-height: 60px;
  line-height: 20px;
  padding: 10px 16px 24px 16px;
}

::v-deep .m-table-header > th {
  background-color: #fafafa !important;
  color: rgba(0, 0, 0, 0.9);
}
::v-deep .el-table--border {
  border-width: 0px;
}
</style>
