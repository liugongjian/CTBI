<template>
  <div class="user-list">
    <common-table
      :table-columns="columns"
      :table-data="tableData"
      :page-num.sync="pageNum"
      :page-size.sync="pageSize"
      :total="total"
      :loading="tableLoading"
      :is-show-default-option="true"
      @sort-change="handleSortChange"
      @refresh="refresh"
    >
      <template #toolbar-left-option>
        <el-button size="small" type="primary" icon="el-icon-plus" style="background-color:#FA8334; border-color: #FA8334" @click="createUser">新建账号</el-button>
      </template>
      <template #toolbar-option>
        <el-input v-model="filterText" placeholder="请输入账号名" size="small">
          <i slot="suffix" class="el-input__icon el-icon-search" />
        </el-input>
      </template>
      <template #lastLoginTime="{scope}">
        <span>{{ scope.row.lastLoginTime | parseTime }}</span>
      </template>
      <template #status="{scope}">
        <div class="status">
          <div class="status-dot" :style="dotStyle(scope.row.status)" />
          <span>{{ formatStatus(scope.row.status) }}</span>
        </div>
      </template>
      <template #operation="{scope}">
        <el-button type="text" style="color:#FA8334" @click.stop="gotoDetail(scope.row)">详情</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" :disabled="logoutDisabled(scope.row)" @click.stop="handleLogOff(scope.row)">注销</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" :disabled="resetDisabled(scope.row)" @click.stop="resetUser(scope.row)">重置</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" :disabled="unfreezeDisabled(scope.row)" @click.stop="handleUnfreeze(scope.row)">解冻</el-button>
      </template>
    </common-table>
    <Reset :reset-visible.sync="resetVisible" :reset-data="resetData" @refresh="getList" />
    <Create :create-visible.sync="createVisible" @refresh="getList" />
    <Detail :detail-visible.sync="detailVisible" :detail-data="detailData" :detail-id="detailId" @refresh="getList" />
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/index.vue'
import { getList, logOffUser, unfreezeUser } from '@/api/userManage'
import Reset from './Reset'
import Create from './Create'
import Detail from './Detail'

export default {
  name: 'UserList',
  components: {
    CommonTable,
    Reset,
    Create,
    Detail
  },
  data () {
    this.adminColumns = [
      {
        prop: 'userName',
        label: '账号名',
        fixed: false
      },
      {
        prop: 'role',
        label: '角色',
        fixed: false
      },
      {
        prop: 'realName',
        label: '真实姓名',
        fixed: false
      },
      {
        prop: 'email',
        width: 250,
        label: '邮箱',
        fixed: false
      },
      {
        prop: 'lastLoginTime',
        width: 150,
        label: '最后登录时间',
        fixed: false,
        slot: 'lastLoginTime',
        sortable: true
      },
      {
        prop: 'status',
        width: 100,
        label: '账号状态',
        fixed: false,
        slot: 'status'
      },
      {
        prop: 'operation',
        width: 220,
        label: '操作',
        slot: 'operation',
        fixed: 'right'
      }
    ]
    this.simpleUserColumns = [
      {
        prop: 'userName',
        label: '账号名',
        fixed: false
      },
      {
        prop: 'role',
        label: '角色',
        fixed: false
      },
      {
        prop: 'realName',
        label: '真实姓名',
        fixed: false
      },
      {
        prop: 'email',
        label: '邮箱',
        fixed: false
      },
      {
        prop: 'creator',
        label: '创建者',
        fixed: false,
        ellipsis: true
      },
      {
        prop: 'lastLoginTime',
        width: 200,
        label: '最后登录时间',
        fixed: false,
        slot: 'lastLoginTime',
        sortable: true
      },
      {
        prop: 'status',
        label: '账号状态',
        fixed: false,
        slot: 'status'
      }
    ]
    this.statusMap = new Map([
      [1, '正常'],
      [-1, '注销'],
      [-2, '已冻结'],
      [-3, '未激活']
    ])
    this.statusColorMap = new Map([
      [1, '#52C41A'],
      [-1, '#00000030'],
      [-2, '#F5212D'],
      [-3, '#FAAD15']
    ])
    this.formItems = [
      { prop: 'keyword', label: '账号查询', props: { placeholder: '请输入关键字查询' } },
      { type: 'select',
        prop: 'status',
        label: '账号状态',
        props: { placeholder: '请选择账号状态', options: this.statusOptions },
        events: { change: this.handleStatusChange }
      }
    ]
    return {
      form: {
        keyword: '',
        status: null
      },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      newDialogVisible: false,
      tableData: [],
      tableLoading: false,
      params: {},
      resetVisible: false,
      resetData: {},
      userName: '',
      createVisible: false,
      detailVisible: false,
      detailData: {},
      detailId: '',
      sortBy: 'lastLoginTime',
      sortOrder: 'desc',
      filterText: ''
    }
  },
  computed: {
    columns () {
      if (this.$store.state.user.userData.role === 'superUser') {
        return this.adminColumns
      }
      return this.simpleUserColumns
    }
  },
  watch: {
    filterText (val) {
      if (val) {
        this.tableData = this.tableDataCache.filter((item) => item.userName.toLowerCase().includes(val.toLowerCase().trim()))
      } else {
        this.tableData = this.tableDataCache
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        this.tableLoading = true
        const params = {
          page: this.pageNum,
          limit: this.pageSize,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          isPaging: 1
        }
        const data = await getList(params)
        this.tableData = data.list
        this.tableData.forEach((item) => {
          item.creator = item.creatorId?.userName
        })
        this.pageNum = data.page
        this.total = data.total
        this.pageSize = data.limit
        this.tableDataCache = this.tableData
        this.tableLoading = false
      } catch (error) {
        console.log(error)
        this.tableLoading = false
        this.tableData = []
        this.tableDataCache = this.tableData
      }
    },
    logoutDisabled (row) {
      return row.status === -1 || row.userName === this.$store.state.user.userData.userName
    },
    resetDisabled (row) {
      return row.from === 'ctyun'
    },
    unfreezeDisabled (row) {
      return row.status !== -2
    },
    formatStatus (status) {
      return this.statusMap.get(status)
    },
    dotStyle (value) {
      const color = this.statusColorMap.get(value)
      return { backgroundColor: color }
    },
    refresh () {
      this.sortOrder = 'desc'
      this.getList()
    },
    handleLogOff (row) {
      if (row.status === -1) {
        this.$message.warning('该账号状态已为注销，无法重复注销！')
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('svg-icon', ('svg-icon', {
              attrs: { iconClass: 'warning', style: 'width:1.5em;height:1.5em;margin-right:10px;vertical-align: -0.35em;' }
            })),
            h('span', null, '该账号将被注销，确认注销？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false
        }).then(async () => {
          try {
            const data = await logOffUser(row._id)
            if (data) {
              this.$message({
                message: '注销成功！',
                type: 'success'
              })
              this.getList()
            }
          } catch (error) {
            console.log(error)
          }
        })
      }
    },
    handleUnfreeze (row) {
      if (row.status !== -2) {
        this.$message.warning('该账号未被冻结，无法解冻！')
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('svg-icon', ('svg-icon', {
              attrs: { iconClass: 'warning', style: 'width:1.5em;height:1.5em;margin-right:10px;vertical-align: -0.35em;' }
            })),
            h('span', null, '是否确定要解冻该账号？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false
        }).then(async () => {
          try {
            const data = await unfreezeUser(row._id)
            if (data) {
              this.$message({
                message: '解冻成功！',
                type: 'success'
              })
              this.getList()
            }
          } catch (error) {
            console.log(error)
          }
        })
      }
    },
    resetUser (row) {
      this.resetVisible = true
      this.resetData = row
    },
    createUser () {
      this.createVisible = true
    },
    handleSortChange ({ prop, order }) {
      this.sortBy = prop
      if (order) {
        this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
      } else {
        this.sortOrder = 'desc'
      }
      this.getList()
    },
    gotoDetail (row) {
      this.detailData = row
      this.detailVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.user-list {
  font-size: 12px;
  .username-link {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .common-table {
    padding: 0 24px;
    background-color: #fff;
    .el-button--text {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .status {
    display: flex;
    align-items: center;
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
  .message-warning {
    width: 1.5em !important;
    height: 1.5em;
    vertical-align: -0.4em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 10px;
  }
}
</style>
