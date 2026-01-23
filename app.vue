
<template>
  <AppToast />
  <div>
    <LoadingScreen v-if="isLoading" class="loading-overlay" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import AppToast from './components/Toast/AppToast.vue';
import LoadingScreen from './components/UI/LoadingScreen.vue';
import { storeLoading } from './infra/store/storeLoading';
import { storeToRefs } from "pinia";

const { isLoading } = storeToRefs(storeLoading());

useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      defer: true
    }
  ]
})
</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(26, 18, 3, 0.8);
  backdrop-filter: blur(13px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
