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
  width: 100%;
}

main {
  flex: 1;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
}

/* footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #888;
} */

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
}
</style>
