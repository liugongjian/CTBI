<template>
  <div>
    <transition>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition>
      <router-view v-if="!$route.meta.keepAlive" />
    </transition>
  </div>
</template>
