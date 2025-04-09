<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { useUserStore } from './store/userStore';

const isAuthenticated = !!useUserStore.user?.isAuthenticated
</script>

<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #888;
}
</style>
