<template>
  <div><v-chart
    v-if="dataValue"
    :option="chartOption"
    autoresize
    :update-options="{notMerge:true}"
  /></div>
</template>

<script>
export default {
  name: 'Disperse'
}
</script>

<style>

</style>
