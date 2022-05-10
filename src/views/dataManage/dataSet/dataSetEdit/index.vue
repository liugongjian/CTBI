<template>
  <div class="edit-wrap">
    <!-- header -->
    <div class="edit-wrap-header">
      <div class="edit-wrap-header-l">
        <i
          class="el-icon-arrow-left h-c-p m-r-8"
          @click="$router.go(-1)"
        />
        <span>{{ dataInfo.dataSetDisplayName || '未命名' }}</span>
      </div>
      <div class="edit-wrap-header-r">
        <div
          class="edit-wrap-header-r-btn"
          @click="saveDataSetDialogVisible = true"
        >保存</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      dataInfo: {}
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>
<style lang="scss" scoped>
.edit-wrap {
  margin: -20px;
  &-header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    background: #2d303b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
  }
  &-main {
    display: flex;
    min-height: calc(100vh - 165px);
    box-sizing: border-box;
    background: #fff;
    &-side {
      width: 250px;
      border-right: 1px solid #ccc;
      position: relative;
      &-shrinked {
        left: -250px;
        width: 0;
      }
      &-btn {
        width: 15px;
        height: 74px;
        background: #ffffff;
        position: absolute;
        box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
        left: 251px;
        top: 100px;
        cursor: pointer;
        z-index: 99;
        line-height: 74px;
        text-align: center;
      }
    }
    &-content {
      flex: 1;
    }
  }
  &-toptool {
    height: 64px;
    background: #f8f8f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    &-l {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-r {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 32px;
    }
  }
}
</style>
