<template>
  <div class="editor-object-container">
    <component :is="name" v-for="(op,name) in option" :key="name" :option="op" />
  </div>
</template>

<script>

export default {
  name: 'FunctionalOption',
  components: { },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      seriesOption: null
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
