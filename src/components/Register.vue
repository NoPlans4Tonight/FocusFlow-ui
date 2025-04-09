<template>
  <div>
    <Navbar />
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="registerData.firstName" placeholder="First Name" required />
      <input v-model="registerData.lastName" placeholder="Last Name" required />
      <input v-model="registerData.username" placeholder="Username" required />
      <input v-model="registerData.email" type="email" placeholder="Email" required />
      <input v-model="registerData.password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue';

export default {
  name: 'Register',
  components: {
    Navbar,
  },
  data() {
    return {
      registerData: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('/register/', this.registerData);
        alert('Registration successful! Please log in.');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Registration error:', error);
        alert(error.response?.data?.detail || 'Registration failed');
      }
    },
  },
};
</script>

<style scoped>
form {
  margin-bottom: 1.5rem;
}

input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>