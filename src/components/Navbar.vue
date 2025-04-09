<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/logout">Logout</router-link></li>
      <li v-else-if="!isRegisterPage"><router-link to="/login">Login</router-link></li>
      <li v-else-if="!isRegisterPage"><router-link to="/register">Register</router-link></li>
    </ul>
  </nav>
</template>

<script>
import { useUserStore } from '../store/userStore';

export default {
  computed: {
    isAuthenticated() {
      return useUserStore().isAuthenticated;
    },
    isRegisterPage() {
      return this.$route.name === 'Register';
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: #333;
  padding: 1rem;
  color: white;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>