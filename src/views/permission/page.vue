<template>
  <el-container>
    <el-header />
    <el-container>
      <el-aisde />
      <el-container>
        <el-header />
        <el-main>
          <page />
        </el-main>
      </el-container>
      <el-aside />
    </el-container>
  </el-container>
</template>

<script>
import page from '@/views/permission/role.vue'
export default {
  components: {
    page
  }
}
</script>

<style>
</style>
