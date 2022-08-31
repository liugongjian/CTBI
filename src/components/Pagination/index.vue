<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="limit"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.pageNum
      },
      set (val) {
        this.$emit('update:pageNum', val)
      }
    },
    limit: {
      get () {
        return this.pageSize
      },
      set (val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.currentPage = 1
      this.$emit('pagination', { pageNum: 1, pageSize: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange (val) {
      this.$emit('pagination', { pageNum: val, pageSize: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style>
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #FA8334;
  border: 1px solid #FA8334;
}
.el-pagination.is-background .el-pager li:not(.disabled) {
  background-color: #FFF;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background-color: #FFF !important;
}
</style>
<style scoped>
.pagination-container {
  background: #fff;
  padding: 15px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
