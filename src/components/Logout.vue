<template>
  <div>
    <h1>Logging Out...</h1>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore';

export default {
  name: 'Logout',
  async mounted() {
    // Clear the user state from userStore
    const userStore = useUserStore();
    await userStore.logout();

    // Redirect to the login page after logout completes
    this.$router.push({ name: 'Login' });
  },
};
</script>

<style scoped>
/* Add any styles for the logout component here */
</style>