<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="合并数据为其他"
    />
    <!-- 合并数据 -->
    <div v-show="option.show" class="editor-item-container flex-align-center">
      <div class="flex-align-center">
        <el-input-number
          v-model="option.num"
          controls-position="right"
          style="width: 100px"
          :min="0"
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
