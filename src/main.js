import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { createPinia } from 'pinia';
import { useUserStore } from './store/userStore';

import './style.css';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Use environment variable for base URL
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add Axios interceptor to include Bearer token
axios.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.userToken) {
    config.headers.Authorization = `Bearer ${userStore.userToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');

// Initialize user store
const userStore = useUserStore();
userStore.initialize();
