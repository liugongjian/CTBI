<template>
  <el-dialog
    title="从模板新建"
    :visible.sync="visible"
    width="1000px"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <div v-loading="loading" class="dialog-content">
      <el-card v-for="item in templateList" :key="item._id" class="box-card">
        <img class="card-img" :src="item.thumbnail">
        <div class="card-name">{{ item.name }}</div>
        <div class="card-description">
          <el-tooltip class="item" effect="dark" :content="item.description" placement="top-start">
            <div class="tooltip-description">{{ item.description }}</div>
          </el-tooltip>
        </div>
        <div class="card-footer">
          <el-button @click.native="handlePreview(item._id)">预览</el-button>
          <el-button type="primary" @click.native="handleApply(item._id)">应用</el-button>
        </div>
      </el-card>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTemplateList } from '@/api/template'

export default {
  props: {
    newCreateVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      templateList: [],
      loading: false
    }
  },
  computed: {
    visible: {
      get() {
        return this.newCreateVisible
      },
      set(val) {
        this.$emit('update:newCreateVisible', val)
      }
    }
  },
  methods: {
    handleOpen() {
      this.getTemplateList()
    },
    handleClose() {
      this.visible = false
    },
    async getTemplateList () {
      try {
        this.loading = true
        const params = {
          isPaging: '0'
        }
        const data = await getTemplateList(params)
        this.templateList = data.result
      } catch (error) {
        console.log(error)
        this.tableData = []
      } finally {
        this.loading = false
      }
    },
    handlePreview(id) {
      const origin = window.location.origin
      const url = origin + `/dashboard?id=${id}&from=template&mode=1`
      window.open(url, '_blank')
    },
    handleApply(id) {
      const origin = window.location.origin
      const url = origin + `/dashboard?id=${id}&from=template`
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: space-between;
  flex-wrap: wrap;
  max-height: 456px;
  min-height: 456px;
  overflow-y: auto;
  .box-card {
    width: 300px;
    flex: 0 0 300px;
    margin: 5px 5px;
    .card-img {
      width: 290px;
      height: 110px;
    }
    .card-name {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      font-weight: 500;
    }
    .card-description {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      font-weight: 400;

      .tooltip-description {
        &::before {
          display: inline;
          content: '描述：';
        }
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .card-footer {
      height: 44px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 0px rgba(200,201,204,0.5);
      border-radius: 0px 0px 4px 4px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 306px;
      transform: translate(-8px, 8px);
    }
    ::v-deep .el-card__body {
      padding: 8px;
    }
  }
}
.dialog-footer{
  padding-top: 10px;
}
</style>
