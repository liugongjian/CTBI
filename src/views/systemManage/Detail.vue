<template>
  <div class="detail">
    <el-drawer
      :visible.sync="visible"
      direction="rtl"
      :modal="false"
      :wrapper-closable="false"
      @open="handleOpen"
    >
      <span slot="title" class="title">
        账号详情
      </span>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="userName">
          <template #label>
            <span>
              账号名
            </span>
          </template>
          {{ form.userName }}
        </el-form-item>
        <el-form-item prop="realName">
          <template #label>
            <span>
              真实姓名
            </span>
          </template>
          <el-input v-if="canEdit" v-model="form.realName" size="small" placeholder="请输入真实姓名" />
          <span v-else>{{ form.realName }}</span>
        </el-form-item>
        <el-form-item prop="phone">
          <template #label>
            <span>
              手机号
            </span>
          </template>
          <el-input v-if="canEdit" v-model="form.phone" size="small" placeholder="请输入手机号" />
          <span v-else>{{ form.phone }}</span>
        </el-form-item>
        <el-form-item prop="email">
          <template #label>
            <span>
              邮箱
            </span>
          </template>
          <el-input v-if="canEdit" v-model="form.email" size="small" placeholder="请输入邮箱" />
          <span v-else>{{ form.email }}</span>
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            <span>
              账号状态
            </span>
          </template>
          <div class="status">
            <div class="status-dot" :style="dotStyle(form.status)" />
            <span>{{ formatStatus(form.status) }}</span>
          </div>
        </el-form-item>
        <el-form-item prop="role">
          <template #label>
            <span>
              角色
            </span>
          </template>
          {{ form.role }}
        </el-form-item>
        <el-form-item prop="from">
          <template #label>
            <span>
              账号类型
            </span>
          </template>
          {{ form.from }}
        </el-form-item>
        <el-form-item prop="creator">
          <template #label>
            <span>
              创建者
            </span>
          </template>
          {{ form.creator }}
        </el-form-item>
        <el-form-item prop="createdTime">
          <template #label>
            <span>
              创建时间
            </span>
          </template>
          {{ form.createdTime | parseTime }}
        </el-form-item>
        <el-form-item prop="lastUpdatedTime">
          <template #label>
            <span>
              上次更新时间
            </span>
          </template>
          {{ form.lastUpdatedTime | parseTime }}
        </el-form-item>
        <el-form-item prop="lastLoginTime">
          <template #label>
            <span>
              最后登录时间
            </span>
          </template>
          {{ form.lastLoginTime | parseTime }}
        </el-form-item>
      </el-form>
      <div class="footer">
        <div v-if="canEdit">
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="small" @click="handleEdit">保 存</el-button>
        </div>
        <div v-else>
          <el-button size="small" @click="handleClose">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { validEmail, validPhone } from '@/utils/validate'
import { exists, editUser } from '@/api/userManage'
import { deepClone } from '@/utils/optionUtils'

export default {
  components: {
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      required: true,
      type: Object
    },
    detailId: {
      type: String,
      default: ''
    }
  },
  data () {
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
    this.rules = {
      realName: [
        { message: '请输入真实姓名', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '真实姓名只允许输入中文和英文', trigger: 'blur' }
      ],
      phone: [
        { message: '请输入手机号', trigger: 'blur' },
        { validator: this.checkPhone, trigger: 'blur' },
        { validator: this.validateExists, trigger: 'blur' }
      ],
      email: [
        { message: '请输入邮箱', trigger: 'blur' },
        { validator: this.checkMail, trigger: 'blur' },
        { validator: this.validateExists, trigger: 'blur' }
      ]
    }
    return {
      form: {
        _id: '',
        userName: '',
        realName: '',
        phone: '',
        email: '',
        form: '',
        status: '',
        creatorId: {},
        role: '',
        lastLoginTime: '',
        createdTime: '',
        LastUpdatedTime: ''
      },
      canEdit: false
    }
  },
  computed: {
    visible: {
      get () {
        return this.detailVisible
      },
      set (val) {
        this.$emit('update:detailVisible', val)
      }
    }
  },
  methods: {
    handleOpen () {
      this.getList()
    },
    getList () {
      this.form = deepClone(this.detailData)
      this.canEdit = this.form.from === 'platform'
    },
    dotStyle (value) {
      const color = this.statusColorMap.get(value)
      return { backgroundColor: color }
    },
    formatStatus (status) {
      return this.statusMap.get(status)
    },
    async handleEdit () {
      const params = {
        realName: this.form.realName,
        phone: this.form.phone,
        email: this.form.email
      }
      const data = await editUser(this.form._id, params)
      if (data) {
        this.$message({
          type: 'success',
          message: '信息更新成功！'
        })
        this.$emit('refresh')
        this.visible = false
      }
    },
    async validateExists (rule, value, callback) {
      const params = rule.field === 'userName' ? { userName: value } : rule.field === 'phone' ? { phone: value } : { email: value }
      const label = rule.field === 'userName' ? '账号名' : rule.field === 'phone' ? '手机号' : '邮箱'
      const isExist = await exists({ ...params, from: 'platform' })
      if (isExist) {
        callback(new Error(`${label}已存在`))
      }
      callback()
    },
    checkMail (rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      }
      callback()
    },
    checkPhone (rule, value, callback) {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
    },
    handleClose () {
      this.$emit('update:detailVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  ::v-deep .el-input__inner {
    font-size: 12px;
    width: 95%;
  }
  ::v-deep .el-form-item__label {
    font-size: 12px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__error {
    padding-top: 0;
  }
  ::v-deep .el-form-item__content {
    font-size: 12px;
  }
  ::v-deep :focus {
    outline: 0;
  }
  ::v-deep .el-drawer__header {
    border-bottom: 1px solid var(--gray-04,#d9d9d9);
    margin-bottom: 10px;
    padding: 10px 20px;
  }
  ::v-deep .el-drawer__body {
    overflow: hidden;
  }
  ::v-deep .el-drawer__open .el-drawer.rtl {
    pointer-events: auto;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    .job-delete {
      display: inline-block;
    }
  }
  .status {
    display: flex;
    align-items: center;
    font-size: 12px;
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
  .footer {
    display: flex;
    border-top: 1px solid #d9d9d9;
    line-height: 50px;
    height: 50px;
    padding: 0 30px;
    bottom: 0;
    position: absolute;
    width: 100%;
    justify-content: center;
  }
   ::v-deep .tags-select-dropdown {
    margin: 0;
    .el-select-dropdown__empty {
      padding: 0;
    }
    .el-select-dropdown__item {
      max-width: 436px;
    }
    .popper__arrow {
      display: none;
    }
    .el-scrollbar {
      .el-select-dropdown__list {
        padding: 0;
      }
    }
  }
}
</style>
