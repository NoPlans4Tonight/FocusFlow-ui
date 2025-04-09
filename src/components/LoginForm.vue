<template>
  <form @submit.prevent="onSubmit">
    <input v-model="username" placeholder="Username" type="text" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </form>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['login'],
  setup(_, { emit }) {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const onSubmit = () => {
      emit('login', { username: username.value, password: password.value });
    };

    return {
      username,
      password,
      errorMessage,
      onSubmit,
    };
  },
};
</script>

<style scoped>
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
</style>
