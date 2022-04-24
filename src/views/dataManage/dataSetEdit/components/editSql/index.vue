<template>
  <div class="edit-sql-wrap">
    <SqlEditor />
  </div>
</template>

<script>
import SqlEditor from '@/components/SqlEditor/index.vue'
export default {
  name: 'EditSql',
  components: {
    SqlEditor
  },
  props: {
    sqlString: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
</style>
