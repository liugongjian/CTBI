<template>
  <section :class="[tagsView? 'fixed-header': '', 'app-main']">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive>
        <router-view
          v-if="$route.meta.keepAlive"
          id="main-page"
          :key="key"
        />
      </keep-alive>
    </transition>
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view
        v-if="!$route.meta.keepAlive"
        id="main-page"
        :key="key"
      />
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
.fixed-header.app-main {
  height: calc(100vh - 125px);
}
</style>
