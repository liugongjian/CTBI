<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="合并数据为其他"
    />
    <!-- 自定义总计名 -->
    <div v-show="option.show" class="editor-item-container flex-align-center">
      <div class="flex-align-center">
        <el-input
          v-model="option.num"
          placeholder="合并为其他保留数量"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MergeOther',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
