<template>
  <div class="login-container">
    <div class="login-header">
      <h1>FocusFlow</h1>
      <p>Your productivity tracker</p>
    </div>
    <div class="login-card">
      <h2>Welcome Back</h2>
      <p>Please log in to continue</p>
      <LoginForm @login="handleLogin" />
      <p>Don't have an account? <router-link to="/register">Register here</router-link>.</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from './LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
  setup() {
    const userStore = useUserStore();
    const errorMessage = ref('');
    const router = useRouter();

    const handleLogin = async ({ username, password }) => {
      try {
        await userStore.login({ username, password });
        router.push({ name: 'Dashboard' });
      } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    };

    return {
      handleLogin,
      errorMessage,
    };
  },
};
</script>

<style scoped>
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

p {
  margin-top: 1rem;
}

@media (min-width: 1025px) {
  .login-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .login-card {
    max-width: 500px;
  }
}
</style>