<template>
  <section :class="[tagsView? 'fixed-header': '', 'app-main']">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters([
      'tagsView'
    ]),
    key () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 90px);
  position: relative;
  overflow: hidden;
}
.fixed-header.app-main {
  height: calc(100vh - 125px);
}
</style>
