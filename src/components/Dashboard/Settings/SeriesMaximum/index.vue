<template>
  <div>
    <div class="editor-object-container">
      <div>
        <el-checkbox
          v-model="option.check"
          label="显示最值"
        />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SeriesMaximum',
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
  mounted () {
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px;
}
</style>
