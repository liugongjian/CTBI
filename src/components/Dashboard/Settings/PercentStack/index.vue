<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.isStack"
        label="堆积"
      />
    </div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.isPercent"
        label="百分比"
      />
    </div>
  </div>

</template>

<script>
export default {
  name: 'PercentStack',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {

    }
  },
  methods: {
  }

}
</script>

<style>
</style>
