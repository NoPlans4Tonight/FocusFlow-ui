<template>
  <div class="login-container">
    <div class="login-header">
      <h1>FocusFlow</h1>
      <p>Your productivity tracker</p>
    </div>
    <div class="login-card">
      <h2>Welcome Back</h2>
      <p>Please log in to continue</p>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" type="text" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/register">Register here</router-link>.</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userStore = useUserStore();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        // Use the user store to handle login
        await userStore.login({ username: username.value, password: password.value });

        // Use the userStore to manage authentication state
        console.log('Access token stored in userStore:', userStore.user.token);

        // Redirect to the Dashboard after successful login
        router.push({ name: 'Dashboard' });
      } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    };

    return {
      username,
      password,
      login,
      errorMessage,
    };
  },
};
</script>

<style scoped>
/* Updated styles for a responsive login landing page */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  font-family: Arial, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 3rem;
  margin: 0;
}

.login-header p {
  font-size: 1.2rem;
  margin: 0.5rem 0 0;
}

.login-card {
  background: #fff;
  color: #333;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

form {
  margin-top: 1rem;
}

input {
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #6a11cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

button:hover {
  background-color: #2575fc;
}

p {
  margin-top: 1rem;
}

@media (min-width: 1025px) {
  .login-container {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .login-card {
    max-width: 500px;
  }
}
</style>